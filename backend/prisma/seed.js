const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const venue = await prisma.venue.create({
        data: {
            name: "Ho Chi Minh City Concert Hall",
            location: "Ho Chi Minh City"
        }
    });

    const event = await prisma.event.create({
        data: {
            title: "Live Concert Chông Gai 2026",
            description: "Big music event",
            startTime: new Date("2026-05-01T19:00:00"),
            venueId: venue.id,
            image: "https://5.pik.vn/c02cff85a283d7059b97a9ae14401850683f5629e11fec8e497acd5676344d2a.webp"
        }
    });

    // generate 100 seats
    for (let i = 1; i <= 100; i++) {
        await prisma.seat.create({
            data: {
                seatNumber: `A${i}`,
                price: 500000,
                eventId: event.id
            }
        });
    }

    console.log("Seed done 🚀");
}

main();