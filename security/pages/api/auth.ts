import { NextApiRequest, NextApiResponse } from 'next';
import * as crypto from 'crypto';
import sqlite3 from 'sqlite3';
import { createHash } from 'crypto';

function hash(string) {
    return createHash('sha256').update(string).digest('hex');
  }

type Callback = (err: Error | null, password?: string) => void;

function generateRSAKeyPair(): { publicKey: string, privateKey: string, n: bigint, e: bigint, d: bigint } {
    const p = generatePrime();
    const q = generatePrime();
    const n = p * q;
    const phi = (p - 1n) * (q - 1n);
    const e = generateE(phi);
    const d = modInverse(e, phi);

    const publicKey = `-----BEGIN PUBLIC KEY-----\n${n.toString(16)}\n${e.toString(16)}\n-----END PUBLIC KEY-----`;
    const privateKey = `-----BEGIN PRIVATE KEY-----\n${n.toString(16)}\n${d.toString(16)}\n-----END PRIVATE KEY-----`;
    console.log('public key:', publicKey)
    console.log('public key:', privateKey)
    return { publicKey, privateKey, n, e, d };
}

function separateString(input) {
    // Split the input string by colon
    const components = input.split(':');

    // Return the array of components
    return components;
}

function generatePrime(): bigint {
    return 7919n;
}

function generateE(phi: bigint): bigint {
    let e = 65537n;
    while (gcd(e, phi) !== 1n) {
        e++;
    }
    return e;
}

function gcd(a: bigint, b: bigint): bigint {
    while (b !== 0n) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function modInverse(a: bigint, m: bigint): bigint {
    let [m0, x0, x1] = [m, 0n, 1n];
    while (a > 1n) {
        const q = a / m;
        [a, m] = [m, a % m];
        [x0, x1] = [x1 - q * x0, x0];
    }
    return x1 < 0n ? x1 + m0 : x1;
}

function encryptWithRSA(publicKey: string, data: Buffer, n: bigint, e: bigint): Buffer {
    const m = BigInt(`0x${data.toString('hex')}`);
    const c = modPow(m, e, n);
    return Buffer.from(c.toString(16), 'hex');
}

function decryptWithRSA(privateKey: string, encryptedData: Buffer, n: bigint, d: bigint): Buffer {
    const hexString = encryptedData.toString('hex');
    const c = BigInt(`0x${hexString}`);
    const m = modPow(c, d, n);
    const resultBuffer = Buffer.alloc(8);
    resultBuffer.writeBigInt64BE(m);
    return resultBuffer;
}

function modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
    if (modulus === 1n) return 0n;
    let result = 1n;
    base %= modulus;
    while (exponent > 0n) {
        if (exponent % 2n === 1n)
            result = (result * base) % modulus;
        exponent >>= 1n;
        base = (base * base) % modulus;
    }
    return result;
}

function generateSymmetricKey(): Buffer {
    return crypto.randomBytes(32);
}

function generateLoginCredentials(username: string, password: string): string {
    return `${username}:${password}`;
}

function encryptWithSymmetricKey(key: Buffer, data: string): Buffer {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
    return Buffer.concat([iv, encrypted]);
}

function decryptWithSymmetricKey(key: Buffer, encryptedData: Buffer): string {
    const iv = encryptedData.slice(0, 16);
    const encrypted = encryptedData.slice(16);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
}

function simulateLogin(username: string, password: string) {
    const { publicKey, privateKey, n, e, d } = generateRSAKeyPair();
    const symmetricKey = generateSymmetricKey();
    console.log("Symmetric Key Length:", symmetricKey.length);
    const encryptedSymmetricKey = encryptWithRSA(publicKey, symmetricKey, n, e);
    console.log("Encrypted Symmetric Key:", encryptedSymmetricKey.toString('base64'));
    const decryptedSymmetricKey = decryptWithRSA(privateKey, encryptedSymmetricKey, n, d);
    const loginCredentials = generateLoginCredentials(username, password);
    const encryptedLoginCredentials = encryptWithSymmetricKey(symmetricKey, loginCredentials); 
    console.log("Encrypted Login Credentials:", encryptedLoginCredentials.toString('base64'));
    const decryptedLoginCredentials = decryptWithSymmetricKey(symmetricKey, encryptedLoginCredentials);
    console.log("Decrypted Login Credentials:", decryptedLoginCredentials);
    const result = separateString(decryptedLoginCredentials);
}

function getPassword(username: string, callback: Callback): void {
    // Open the database
    const db = new sqlite3.Database('./accounts.db', (err: Error | null) => {
        if (err) {
            callback(err);
            return;
        }
    });

    // Query the password for the given username
    db.all(`SELECT password FROM account WHERE username = ?`, [username], (err: Error | null, rows: { password: string }[]) => {
        if (err) {
            callback(err);
        } else if (rows.length === 0) {
            callback(new Error('No user found with the given username.'));
        } else {
            const password = rows[0].password;
            callback(null, password);
        }
    });

    // Close the database
    db.close((err: Error | null) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
        }
    });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { username, password } = req.body;
        
        // Check password against the database
        getPassword(username, (err, dbPassword) => {
            if (err) {
                console.error('Error:', err.message);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            } else {
                const hashedPassword = hash(password);
                if (dbPassword === hashedPassword) {
                    // Password is correct
                    simulateLogin(username, password);
                    res.status(200).json({ message: 'Login successful' });
                } else {
                    // Password is incorrect
                    res.status(401).json({ error: 'Unauthorized', message: 'Incorrect username or password' });
                }
            }
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
