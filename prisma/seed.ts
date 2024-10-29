import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
// const products = require('./fakeProducts.json');
const products = require('./fakeProducts_newcategory.json');

const prisma = new PrismaClient();


async function downlaodImage(url: string, filePath: string) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });

    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
    })
}


async function seed() {
    const client = new OpenAI({
        apiKey: process.env['OPENAI_API_KEY'],
    });

    for (const product of products) {
        try {
            const response = await client.images.generate({
                model: "dall-e-3",
                prompt: `Generate a high-quality product image for: ${product.name}`,
                n: 1,
                size: '1024x1024',
            });

            const imageUrl = response.data[0].url;

            const filename = `${product.name.replace(/\s+/g, '_')}.png`;
            const filepath = path.join(__dirname, '..', 'assets', 'images', filename);

            await downlaodImage(imageUrl, filepath);

            const category = await prisma.category.findUnique({
                where: {
                    name: product.category,
                },
            });

            if (!category) {
                console.error(`Category not found for product: ${product.name}`);
                continue;
            }

            await prisma.product.create({
                data: {
                    name: product.name,
                    price: product.price,
                    categoryId: category.id,
                    description: product.description,
                    imageUrl: `/images/${filename}`,
                },
            });
            console.log(`Added product: ${product.name} with local image: /images/${filename}`);
        } catch (error) {
            console.error(`Error generating image for ${product.name}`, error);
        }
    }
    console.log('Seeding finished')
}

async function seeedColorsAndBrands() {

    // Funkcja pomocnicza do losowania elementu
    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    async function getOrCreateBrand(name) {
        const brand = await prisma.brand.findUnique({ where: { name } });
        if (brand) return brand; // Jeśli marka już istnieje, zwróć ją

        // Jeśli nie istnieje, utwórz nową
        return await prisma.brand.create({ data: { name } });
    }

    async function getOrCreateColor(name) {
        const color = await prisma.color.findUnique({ where: { name } });
        if (color) return color; // Jeśli kolor już istnieje, zwróć go

        // Jeśli nie istnieje, utwórz nowy
        return await prisma.color.create({ data: { name } });
    }

    const colors = ['RED', 'BLUE', 'ORANGE', 'WHITE', 'BLACK', 'GREY', 'PINK'];
    const brands = ['South Face', 'Abibas', 'Nuke', 'Sunshine', 'Beebok'];

    // Iterujemy po wszystkich produktach
    const products = await prisma.product.findMany(); // Pobierz wszystkie produkty

    for (const product of products) {
        // Losowanie marki i koloru
        const randomBrandName = getRandomElement(brands);
        const randomColorName = getRandomElement(colors);

        // Zdobądź lub stwórz nową markę i kolor
        const brand = await getOrCreateBrand(randomBrandName);
        const color = await getOrCreateColor(randomColorName);

        // Aktualizuj produkt
        await prisma.product.update({
            where: { id: product.id },
            data: {
                brandId: brand.id, // Przypisanie identyfikatora marki
                colorId: color.id, // Przypisanie identyfikatora koloru
            },
        });
    }
}



// seed()
seeedColorsAndBrands()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
