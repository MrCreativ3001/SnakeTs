import assetNames from "../assets";
const loadedAssets: Record<string, HTMLImageElement> = {};

type LoadedAsset = {
    name: string,
    image: HTMLImageElement
}

export async function loadAssets() {
    const loadingAssets: Promise<LoadedAsset>[] = [];
    for (const key in assetNames) {
        // we need to remove the first 2 chars("./") of the key
        const path = key.slice(2);
        loadingAssets.push(loadAsset(assetNames[key], path));
    }
    (await Promise.all(loadingAssets)).forEach((asset) => {
        loadedAssets[asset.name] = asset.image;
    });
}

function loadAsset(src: string, name: string): Promise<LoadedAsset> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve({ name, image });
        image.onerror = reject;
        image.src = src;
    });
}

export function getAsset(name: string): HTMLImageElement | undefined {
    return loadedAssets[name];
}
