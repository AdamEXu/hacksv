// API functions - simple, no error handling
export async function fetchEventList(): Promise<string[]> {
    const response = await fetch("https://cdn.hack.sv/ls.json");
    return await response.json();
}

export async function fetchEventImages(eventName: string): Promise<string[]> {
    const response = await fetch(`https://cdn.hack.sv/${eventName}.json`);
    const images = await response.json();
    return images.map((img: string) => `https://cdn.hack.sv${img}`);
}

export async function fetchAllImages(): Promise<string[]> {
    const events = await fetchEventList();
    const allImagePromises = events.map((event) => fetchEventImages(event));
    const allImageArrays = await Promise.all(allImagePromises);

    // Flatten all image arrays into one list
    const allImages = allImageArrays.flat();

    // Shuffle the images for randomness
    const shuffled = [...allImages].sort(() => Math.random() - 0.5);

    return shuffled;
}
