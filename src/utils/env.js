import "dotenv/config";

export const env = (name, defaultValue) => {
    const value = process.env[name];
    if (!value && !defaultValue) {
        throw new Error(`Missing process.env[${name}]`); 
    }
    return value || defaultValue;
};
