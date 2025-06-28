// Database Manager using IndexedDB
export class DatabaseManager {
    constructor() {
        this.dbName = 'propertyManagementDB';
        this.dbVersion = 5; // Increased version to trigger onupgradeneeded
        this.db = null;
        this.initPromise = null;
    }

    async initialize() {
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                console.error('Database error:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('Database opened successfully');
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                console.log('Database upgrade needed. Current version:', event.oldVersion, 'New version:', event.newVersion);
                
                // Create accounts store if it doesn't exist
                if (!db.objectStoreNames.contains('accounts')) {
                    console.log('Creating accounts store...');
                    const accountsStore = db.createObjectStore('accounts', { keyPath: 'id', autoIncrement: true });
                    accountsStore.createIndex('username', 'username', { unique: true });
                    accountsStore.createIndex('email', 'email', { unique: true });
                    accountsStore.createIndex('status', 'status', { unique: false });
                    console.log('Accounts store created');

                    // Create sample accounts
                    const transaction = event.target.transaction;
                    const accountsStoreObj = transaction.objectStore('accounts');

                    const sampleAccounts = [
                        {
                            username: 'admin',
                            email: 'admin@example.com',
                            password: 'admin123',
                            status: 'active',
                            createdAt: new Date().toISOString()
                        },
                        {
                            username: 'staff1',
                            email: 'staff1@example.com',
                            password: 'staff123',
                            status: 'active',
                            createdAt: new Date().toISOString()
                        },
                        {
                            username: 'tenant1',
                            email: 'tenant1@example.com',
                            password: 'tenant123',
                            status: 'active',
                            createdAt: new Date().toISOString()
                        }
                    ];

                    sampleAccounts.forEach(account => {
                        accountsStoreObj.add(account);
                    });
                    console.log('Sample accounts created');
                }

                // Create admins store if it doesn't exist
                if (!db.objectStoreNames.contains('admins')) {
                    console.log('Creating admins store...');
                    const adminsStore = db.createObjectStore('admins', { keyPath: 'email' });
                    console.log('Admins store created');

                    // Add initial admin
                    const transaction = event.target.transaction;
                    const adminsStoreObj = transaction.objectStore('admins');
                    adminsStoreObj.add({ email: 'admin@example.com' });
                    console.log('Initial admin added');
                }
                
                // Delete all other object stores (if they exist)
                const storeNames = Array.from(db.objectStoreNames);
                for (const storeName of storeNames) {
                    if (storeName !== 'accounts' && storeName !== 'admins') {
                        db.deleteObjectStore(storeName);
                        console.log(`Object store ${storeName} deleted`);
                    }
                }
            };
        });

        return this.initPromise;
    }

    async verifyAccount(username, password) {
        await this.initialize();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['accounts'], 'readonly');
            const store = transaction.objectStore('accounts');
            const index = store.index('username');
            const request = index.get(username);

            request.onsuccess = (event) => {
                const account = event.target.result;
                if (account && account.password === password && account.status === 'active') {
                    resolve(account);
                } else {
                    reject(new Error('Invalid username or password'));
                }
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async createAccount(account) {
        await this.initialize();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['accounts'], 'readwrite');
            const store = transaction.objectStore('accounts');
            
            // First check if email already exists
            const emailIndex = store.index('email');
            const emailCheck = emailIndex.get(account.email);
            
            emailCheck.onsuccess = (event) => {
                if (event.target.result) {
                    reject(new Error('Email address is already in use'));
                } else {
                    // Email is not in use, proceed with account creation
                    const request = store.add(account);
                    
                    request.onsuccess = () => {
                        resolve(account);
                    };

                    request.onerror = (event) => {
                        if (event.target.error.name === 'ConstraintError') {
                            reject(new Error('Username already exists'));
                        } else {
                            reject(event.target.error);
                        }
                    };
                }
            };

            emailCheck.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async getAccount(username) {
        await this.initialize();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['accounts'], 'readonly');
            const store = transaction.objectStore('accounts');
            const index = store.index('username');
            const request = index.get(username);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async getAllAccounts() {
        await this.initialize();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['accounts'], 'readonly');
            const store = transaction.objectStore('accounts');
            const request = store.getAll();

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async updateAccount(username, updates) {
        await this.initialize();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['accounts'], 'readwrite');
            const store = transaction.objectStore('accounts');
            const index = store.index('username');
            const request = index.get(username);

            request.onsuccess = (event) => {
                const account = event.target.result;
                if (account) {
                    // Apply updates to the account object
                    Object.assign(account, updates);
                    
                    // Put the updated account back in the store
                    const updateRequest = store.put(account);

                updateRequest.onsuccess = () => {
                        resolve(account);
                };

                updateRequest.onerror = (event) => {
                    reject(event.target.error);
                };
                } else {
                    reject(new Error('Account not found'));
                }
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async deleteAccount(accountId) {
        await this.initialize();
        return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['accounts'], 'readwrite');
                const store = transaction.objectStore('accounts');
            const request = store.delete(accountId);

                request.onsuccess = () => {
                    resolve();
            };
            
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async resetPassword(accountId, newPassword) {
        await this.initialize();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['accounts'], 'readwrite');
            const store = transaction.objectStore('accounts');
            const request = store.get(accountId);

            request.onsuccess = (event) => {
                const account = event.target.result;
                if (account) {
                account.password = newPassword;
                    
                const updateRequest = store.put(account);

                updateRequest.onsuccess = () => {
                    resolve();
                };

                updateRequest.onerror = (event) => {
                    reject(event.target.error);
                };
            } else {
                    reject(new Error('Account not found'));
                }
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async isAdmin(email) {
        await this.initialize();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['admins'], 'readonly');
            const store = transaction.objectStore('admins');
            const request = store.get(email);

            request.onsuccess = (event) => {
                resolve(!!event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async addAdmin(email) {
        await this.initialize();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['admins'], 'readwrite');
            const store = transaction.objectStore('admins');
            const request = store.add({ email });

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (event) => {
                if (event.target.error.name === 'ConstraintError') {
                    reject(new Error('Admin already exists'));
                } else {
                    reject(event.target.error);
                }
            };
        });
    }

    async removeAdmin(email) {
        await this.initialize();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['admins'], 'readwrite');
            const store = transaction.objectStore('admins');
            const request = store.delete(email);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async getAllAdmins() {
        await this.initialize();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['admins'], 'readonly');
            const store = transaction.objectStore('admins');
            const request = store.getAll();

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }
}

// Make DatabaseManager globally available
window.DatabaseManager = DatabaseManager; 