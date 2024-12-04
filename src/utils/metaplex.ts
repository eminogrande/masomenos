import { Metaplex } from '@metaplex-foundation/js';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { TOKEN_METADATA_PROGRAM_ID } from './constants';

const connection = new Connection(clusterApiUrl('devnet'));
const metaplex = Metaplex.make(connection)
  .use({
    tokenMetadataProgramId: new PublicKey(TOKEN_METADATA_PROGRAM_ID),
  });

export async function createNFT(
  wallet: Window['solana'],
  name: string,
  symbol: string,
  description: string,
  imageUrl: string,
  attributes: Array<{ trait_type: string; value: string }>
) {
  if (!wallet?.publicKey) throw new Error('Wallet not connected');

  try {
    const { nft } = await metaplex
      .use({ identity: wallet })
      .nfts()
      .create({
        name,
        symbol,
        uri: imageUrl,
        sellerFeeBasisPoints: 500,
        tokenOwner: wallet.publicKey,
        updateAuthority: wallet.publicKey,
        metadata: {
          name,
          symbol,
          description,
          image: imageUrl,
          attributes,
          properties: {
            files: [{ uri: imageUrl, type: 'image/jpeg' }]
          }
        }
      });

    return {
      signature: nft.address.toString(),
      metadata: {
        name,
        symbol,
        description,
        image: imageUrl,
        attributes,
      },
    };
  } catch (error) {
    console.error('Error creating NFT:', error);
    throw error;
  }
}