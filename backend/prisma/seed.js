const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const venue = await prisma.venue.create({
        data: {
            name: "Da Lat Concert Hall",
            location: "Da Lat"
        }
    });

    const event = await prisma.event.create({
        data: {
            title: "Live Concert 2026",
            description: "Big music event",
            startTime: new Date("2026-05-01T19:00:00"),
            venueId: venue.id
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