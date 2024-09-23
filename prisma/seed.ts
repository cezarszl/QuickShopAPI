import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    // Utworzenie przykładowych kategorii
    const categories = [
        'Electronics',
        'Books',
        'Clothing',
        'Home & Kitchen',
        'Sports',
    ];

    for (const categoryName of categories) {
        await prisma.category.create({
            data: {
                name: categoryName,
            },
        });
    }


    for (let i = 0; i < 20; i++) {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: faker.internet.password(),
                name: faker.person.fullName(),
            },
        });


        const randomCategoryIndex = Math.floor(Math.random() * categories.length);
        const category = await prisma.category.findUnique({
            where: { name: categories[randomCategoryIndex] },
        });

        await prisma.product.create({
            data: {
                category: {
                    connect: { id: category.id },
                },
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                imageUrl: faker.image.url(),
                price: parseFloat(faker.commerce.price()),
            },
        });
    }
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
