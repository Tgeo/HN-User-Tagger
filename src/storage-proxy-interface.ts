/** Abstracts access to the storage.local API. */
interface StorageProxyInterface {
    get(keys: Object, callback: (items: { [key: string]: any }) => void): void;
    set(items: Object, callback?: () => void): void;
}