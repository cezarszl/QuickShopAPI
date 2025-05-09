import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import axios from 'axios';
const sharp = require('sharp');
import * as fs from 'fs';
import * as path from 'path';

const products = require('./fakeProducts_new25.json');
const prisma = new PrismaClient();

const colors = ['RED', 'BLUE', 'ORANGE', 'WHITE', 'BLACK', 'GREY', 'PINK'];
const brands = ['South Face', 'Abibas', 'Nuke', 'Sunshine', 'Beebok'];

// Funkcja losująca element z tablicy
function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function getOrCreateBrand(name: string) {
    const brand = await prisma.brand.findUnique({ where: { name } });
    if (brand) return brand;
    return prisma.brand.create({ data: { name } });
}

async function getOrCreateColor(name: string) {
    const color = await prisma.color.findUnique({ where: { name } });
    if (color) return color;
    return prisma.color.create({ data: { name } });
}

async function downloadImageAndConvertToWebp(url: string, outputFilePath: string) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer',
    });

    const buffer = Buffer.from(response.data, 'binary');

    await sharp(buffer)
        .webp({ quality: 80 })
        .toFile(outputFilePath);
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

            const filename = `${product.name.replace(/\s+/g, '_')}.webp`;
            const filepath = path.join(__dirname, '..', 'assets', 'images', filename);

            await downloadImageAndConvertToWebp(imageUrl, filepath);

            const category = await prisma.category.findUnique({
                where: {
                    name: product.category,
                },
            });

            if (!category) {
                console.error(`❌ Category not found for product: ${product.name}`);
                continue;
            }

            const randomBrand = await getOrCreateBrand(getRandomElement(brands));
            const randomColor = await getOrCreateColor(getRandomElement(colors));

            await prisma.product.create({
                data: {
                    name: product.name,
                    price: product.price,
                    categoryId: category.id,
                    brandId: randomBrand.id,
                    colorId: randomColor.id,
                    description: product.description,
                    imageUrl: `/images/${filename}`,
                },
            });

            console.log(`✅ Added: ${product.name} → /images/${filename}`);
        } catch (error) {
            console.error(`❌ Error processing ${product.name}`, error);
        }
    }

    console.log('🌱 Seeding completed.');
}

seed()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
