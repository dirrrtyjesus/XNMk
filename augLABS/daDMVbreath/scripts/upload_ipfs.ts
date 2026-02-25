
import { PinataSDK } from "pinata-web3";
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// User must provide JWT
const PINATA_JWT = process.env.PINATA_JWT || '';

async function main() {
    if (!PINATA_JWT) {
        console.error('❌ Error: PINATA_JWT environment variable not set.');
        console.log('Please get a free key from https://app.pinata.cloud/developers/keys');
        process.exit(1);
    }

    const pinata = new PinataSDK({
        pinataJwt: PINATA_JWT,
        pinataGateway: "gateway.pinata.cloud",
    });

    console.log('🜏 Initializing IPFS Upload Sequence...');

    // 1. Upload Image
    // Find the generated image in the brain artifact folder (User needs to move it or we point to it)
    // For this script, we expect the image to be in the root or assets folder. 
    // Let's assume the user has placed the image path as an arg, or we try to find it.

    // Note: Since I cannot move files from the .gemini folder easily without knowing the exact ID in this context
    // reliably across sessions, I will ask user to provide path.
    const imagePath = process.argv[2];

    if (!imagePath || !fs.existsSync(imagePath)) {
        console.error('❌ Usage: npx ts-node scripts/upload_ipfs.ts <PATH_TO_IMAGE>');
        process.exit(1);
    }

    console.log(`📤 Uploading Image: ${imagePath}...`);

    const imageFile = fs.readFileSync(imagePath);
    // Pinata SDK for Node might need Blob or File polyfill, or we use stream. 
    // The simplified SDK often takes a file object. Let's try standard upload.

    try {
        // Create a File-like object for Pinata
        const fileObj = new File([imageFile], "therapy_token.png", { type: "image/png" });
        const upload = await pinata.upload.file(fileObj);

        const imageIpfsHash = upload.IpfsHash;
        const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageIpfsHash}`;

        console.log(`✅ Image Uploaded: ${imageUrl}`);

        // 2. Create Metadata
        console.log('📝 Composing Metadata...');

        const metadata = {
            name: "Therapy",
            symbol: "THERAPY",
            description: "High-Fidelity Stillness. The reward for metabolic coherence in the Xenial Ecosystem. Proof of Breath.",
            image: imageUrl, // Link to the IPFS image
            external_url: "https://auglabs.xyz",
            attributes: [
                { trait_type: "Composition", value: "Bio-Digital" },
                { trait_type: "Element", value: "Sulfur 🜏" },
                { trait_type: "Yield", value: "Stillness" }
            ],
            properties: {
                files: [{ uri: imageUrl, type: "image/png" }],
                category: "image",
                creators: [{ address: "6Ft3FwwNwPmDqfvCUjjQ3zgAjR85vhody6KzrqDNkRPh", share: 100 }]
            }
        };

        // 3. Upload Metadata
        console.log('📤 Uploading Metadata JSON...');
        const jsonUpload = await pinata.upload.json(metadata);

        const jsonIpfsHash = jsonUpload.IpfsHash;
        const jsonUrl = `https://gateway.pinata.cloud/ipfs/${jsonIpfsHash}`;

        console.log(`✅ Metadata Uploaded: ${jsonUrl}`);
        console.log('\n🜏 NEXT STEP:');
        console.log(`npx ts-node scripts/inject_metadata.ts ${jsonUrl}`);

    } catch (error) {
        console.error('❌ Upload Failed:', error);
    }
}

main();
