/**
 * IPFS Upload Service
 * Upload files and metadata to IPFS via Pinata
 */

export interface UploadResult {
    uri: string;
    hash: string;
}

/**
 * Upload file to IPFS via Pinata
 * Returns IPFS URI for use in metadata
 */
export async function uploadToIPFS(
    file: File,
    apiKey?: string
): Promise<UploadResult> {
    const key = apiKey || import.meta.env.VITE_PINATA_JWT;

    if (!key) {
        // For demo/testing without IPFS, return a placeholder
        console.warn('No Pinata API key provided, using placeholder URI');
        return {
            uri: `ipfs://demo-${Date.now()}`,
            hash: `demo-${Date.now()}`,
        };
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${key}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`IPFS upload failed: ${error}`);
    }

    const data = await response.json();
    return {
        uri: `ipfs://${data.IpfsHash}`,
        hash: data.IpfsHash,
    };
}

/**
 * Upload JSON metadata to IPFS via Pinata
 */
export async function uploadMetadataToIPFS(
    metadata: object,
    apiKey?: string
): Promise<UploadResult> {
    const key = apiKey || import.meta.env.VITE_PINATA_JWT;

    if (!key) {
        // For demo/testing without IPFS, return a placeholder
        console.warn('No Pinata API key provided, using placeholder URI');
        return {
            uri: `ipfs://demo-metadata-${Date.now()}`,
            hash: `demo-metadata-${Date.now()}`,
        };
    }

    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            pinataContent: metadata,
            pinataMetadata: {
                name: 'daThiccNOW-metadata.json',
            },
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Metadata upload failed: ${error}`);
    }

    const data = await response.json();
    return {
        uri: `ipfs://${data.IpfsHash}`,
        hash: data.IpfsHash,
    };
}

/**
 * Convert IPFS URI to HTTP gateway URL for display
 */
export function ipfsToHttpUrl(ipfsUri: string): string {
    if (ipfsUri.startsWith('ipfs://')) {
        const hash = ipfsUri.replace('ipfs://', '');
        return `https://gateway.pinata.cloud/ipfs/${hash}`;
    }
    return ipfsUri;
}
