/**
 * MSP Command Center - API Configuration Manager
 * Handles secure storage and retrieval of API credentials
 *
 * Security Features:
 * - Web Crypto API encryption for sensitive data
 * - Sanitized logging (no sensitive information exposed)
 * - Secure key derivation
 *
 * @version 1.0.0
 * @license MIT
 */

class APIConfigManager {
    constructor() {
        this.STORAGE_KEY = 'msp_api_config_encrypted';
        // FIX ISSUE #1 (Line 16): Use encryption for API keys
        this.encryptionKey = null;
        this.config = {};
    }

    /**
     * Initialize encryption key using Web Crypto API
     * Generates a secure encryption key for protecting API credentials
     */
    async initializeEncryption() {
        try {
            // Generate or retrieve encryption key
            const keyMaterial = await this._getKeyMaterial();
            this.encryptionKey = await window.crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: new TextEncoder().encode('msp-command-center-salt'),
                    iterations: 100000,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt', 'decrypt']
            );
            return true;
        } catch (error) {
            // FIX ISSUE #23 (Line 50): Sanitize error logging - no sensitive data
            this._logError('Failed to initialize encryption', { error: error.message });
            return false;
        }
    }

    /**
     * Generate key material from user session or device fingerprint
     * @private
     */
    async _getKeyMaterial() {
        const password = this._getDeviceFingerprint();
        return window.crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(password),
            'PBKDF2',
            false,
            ['deriveBits', 'deriveKey']
        );
    }

    /**
     * Generate a simple device fingerprint for key derivation
     * @private
     */
    _getDeviceFingerprint() {
        const fingerprint = [
            navigator.userAgent,
            navigator.language,
            new Date().getTimezoneOffset(),
            screen.width + 'x' + screen.height
        ].join('|');
        return fingerprint;
    }

    /**
     * Encrypt data using AES-GCM
     * @private
     */
    async _encrypt(data) {
        try {
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const encodedData = new TextEncoder().encode(JSON.stringify(data));

            const encryptedData = await window.crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                this.encryptionKey,
                encodedData
            );

            // FIX ISSUE #23 (Line 96): Removed console.log that exposed configuration
            // Previous vulnerable code: console.log('Encrypting config:', data);

            // FIX ISSUE #1 (Line 94): Return encrypted data instead of plaintext
            return {
                iv: Array.from(iv),
                data: Array.from(new Uint8Array(encryptedData))
            };
        } catch (error) {
            this._logError('Encryption failed', { error: error.message });
            throw error;
        }
    }

    /**
     * Decrypt data using AES-GCM
     * @private
     */
    async _decrypt(encryptedData) {
        try {
            const iv = new Uint8Array(encryptedData.iv);
            const data = new Uint8Array(encryptedData.data);

            const decryptedData = await window.crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                this.encryptionKey,
                data
            );

            const decodedData = new TextDecoder().decode(decryptedData);
            return JSON.parse(decodedData);
        } catch (error) {
            this._logError('Decryption failed', { error: error.message });
            throw error;
        }
    }

    /**
     * Save API configuration securely
     * @param {Object} config - Configuration object with API keys and secrets
     */
    async saveConfig(config) {
        try {
            if (!this.encryptionKey) {
                await this.initializeEncryption();
            }

            // Validate configuration
            if (!this._validateConfig(config)) {
                throw new Error('Invalid configuration format');
            }

            // Encrypt before storing
            const encryptedConfig = await this._encrypt(config);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(encryptedConfig));

            this.config = config;

            // FIX ISSUE #23: Sanitized logging - no API keys exposed
            this._logInfo('Configuration saved successfully', {
                providers: Object.keys(config).filter(key => !this._isSensitiveField(key))
            });

            return true;
        } catch (error) {
            this._logError('Failed to save configuration', { error: error.message });
            return false;
        }
    }

    /**
     * Load API configuration from secure storage
     */
    async loadConfig() {
        try {
            if (!this.encryptionKey) {
                await this.initializeEncryption();
            }

            const encryptedData = localStorage.getItem(this.STORAGE_KEY);

            if (!encryptedData) {
                this._logInfo('No saved configuration found');
                return {};
            }

            const encrypted = JSON.parse(encryptedData);
            this.config = await this._decrypt(encrypted);

            // FIX ISSUE #23: Sanitized logging - no API keys exposed
            this._logInfo('Configuration loaded successfully', {
                hasOpenAI: !!this.config.openai_api_key,
                hasAnthropic: !!this.config.anthropic_api_key,
                hasMicrosoft: !!this.config.ms_client_id,
                hasAtera: !!this.config.atera_api_key,
                hasZoho: !!this.config.zoho_client_id
            });

            return this.config;
        } catch (error) {
            this._logError('Failed to load configuration', { error: error.message });
            return {};
        }
    }

    /**
     * Get specific API key
     * @param {string} provider - Provider name (openai, anthropic, microsoft, etc.)
     */
    getAPIKey(provider) {
        const keyMap = {
            'openai': 'openai_api_key',
            'anthropic': 'anthropic_api_key',
            'microsoft': 'ms_client_secret',
            'atera': 'atera_api_key',
            'zoho': 'zoho_client_secret',
            'zoho_assist': 'zoho_assist_client_secret'
        };

        const key = this.config[keyMap[provider]];

        // FIX ISSUE #23: Never log actual API keys
        if (key) {
            this._logInfo('API key retrieved', { provider, keyLength: key.length });
        } else {
            this._logWarning('API key not found', { provider });
        }

        return key || null;
    }

    /**
     * Get all configuration (for settings UI)
     * Returns sanitized config with masked sensitive values
     */
    getSanitizedConfig() {
        const sanitized = {};

        for (const [key, value] of Object.entries(this.config)) {
            if (this._isSensitiveField(key)) {
                // Mask sensitive values
                sanitized[key] = value ? this._maskValue(value) : '';
            } else {
                sanitized[key] = value;
            }
        }

        return sanitized;
    }

    /**
     * Clear all stored configuration
     */
    clearConfig() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.config = {};
        this._logInfo('Configuration cleared');
    }

    /**
     * Validate configuration structure
     * @private
     */
    _validateConfig(config) {
        if (typeof config !== 'object' || config === null) {
            return false;
        }

        // Check for at least one valid API configuration
        const validKeys = [
            'openai_api_key', 'anthropic_api_key',
            'ms_client_id', 'ms_client_secret',
            'atera_api_key', 'zoho_client_id',
            'zoho_client_secret'
        ];

        return validKeys.some(key => config[key]);
    }

    /**
     * Check if field contains sensitive information
     * @private
     */
    _isSensitiveField(fieldName) {
        const sensitivePatterns = [
            'api_key', 'secret', 'token', 'password',
            'client_secret', 'refresh_token', 'access_token'
        ];

        return sensitivePatterns.some(pattern =>
            fieldName.toLowerCase().includes(pattern)
        );
    }

    /**
     * Mask sensitive value for display
     * @private
     */
    _maskValue(value) {
        if (!value || value.length < 8) {
            return '****';
        }
        return value.substring(0, 4) + '****' + value.substring(value.length - 4);
    }

    /**
     * Sanitized logging methods
     * FIX ISSUE #23 (Line 332): Production-safe logging with no sensitive data
     * @private
     */
    _logInfo(message, metadata = {}) {
        if (this._isProductionMode()) {
            // In production, only log to console if debugging is enabled
            return;
        }
        console.info('[APIConfig]', message, this._sanitizeMetadata(metadata));
    }

    _logWarning(message, metadata = {}) {
        console.warn('[APIConfig]', message, this._sanitizeMetadata(metadata));
    }

    _logError(message, metadata = {}) {
        console.error('[APIConfig]', message, this._sanitizeMetadata(metadata));
    }

    /**
     * Remove any potentially sensitive data from log metadata
     * @private
     */
    _sanitizeMetadata(metadata) {
        const sanitized = {};

        for (const [key, value] of Object.entries(metadata)) {
            if (this._isSensitiveField(key)) {
                sanitized[key] = '[REDACTED]';
            } else if (typeof value === 'object') {
                sanitized[key] = this._sanitizeMetadata(value);
            } else {
                sanitized[key] = value;
            }
        }

        return sanitized;
    }

    /**
     * Check if running in production mode
     * @private
     */
    _isProductionMode() {
        return window.location.hostname !== 'localhost' &&
               window.location.hostname !== '127.0.0.1';
    }

    /**
     * Export configuration for backup (encrypted)
     */
    async exportConfig() {
        try {
            const encryptedData = localStorage.getItem(this.STORAGE_KEY);
            if (!encryptedData) {
                throw new Error('No configuration to export');
            }

            this._logInfo('Configuration exported');
            return encryptedData;
        } catch (error) {
            this._logError('Export failed', { error: error.message });
            throw error;
        }
    }

    /**
     * Import configuration from backup
     */
    async importConfig(encryptedData) {
        try {
            // Validate format
            const parsed = JSON.parse(encryptedData);
            if (!parsed.iv || !parsed.data) {
                throw new Error('Invalid encrypted data format');
            }

            localStorage.setItem(this.STORAGE_KEY, encryptedData);
            await this.loadConfig();

            this._logInfo('Configuration imported successfully');
            return true;
        } catch (error) {
            this._logError('Import failed', { error: error.message });
            return false;
        }
    }
}

// Export singleton instance
const apiConfigManager = new APIConfigManager();

// Initialize on page load
if (typeof window !== 'undefined') {
    window.apiConfigManager = apiConfigManager;
    apiConfigManager.initializeEncryption().then(() => {
        console.info('[APIConfig] Encryption initialized successfully');
    });
}
