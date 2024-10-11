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

seed()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
