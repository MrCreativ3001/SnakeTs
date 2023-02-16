// Imports all assets and stores them in a record with the key being the "real" name and the other being the path where its at after building
const assetNames: Record<string, string> = {};

function importAll(r: ReturnType<typeof require.context>) {
    r.keys().forEach((key: string) => (assetNames[key] = r(key)));
}
importAll(require.context('/', false, /\.(png|jpe?g|svg)$/));
export default assetNames;
