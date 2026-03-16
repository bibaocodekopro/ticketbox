// Create fake data for events, venues, and seats using Prisma and Elasticsearch

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { Client } = require('@elastic/elasticsearch');

const es = new Client({
    node: 'http://localhost:9200'
});

async function main() {

    // const exists = await es.indices.exists({ index: "events" });

    // if (exists) {
    //     await es.indices.delete({ index: "events" });
    // }

    // await es.indices.create({
    //     index: "events",
    //     mappings: {
    //         properties: {
    //             title: { type: "text" },
    //             description: { type: "text" },
    //             venue: { type: "keyword" },
    //             location: { type: "keyword" },
    //             startTime: { type: "date" },
    //             image: { type: "keyword" }
    //         }
    //     }
    // });
    // console.log("Elasticsearch index created")

    const venue = await prisma.venue.create({
        data: {
            name: "Sân Vận Động Thống Nhất",
            location: "Quận 10, TP. Hồ Chí Minh"
        }
    });

    const titles = [
        "Rock The City Night",
        "Saigon EDM Takeover",
        "Ballad In The Rain",
        "Vietnam Indie Fest",
        "HipHop Underground Live",
        "Golden Voice Concert",
        "Summer Fire Show",
        "Neon Dance Arena",
        "The Legends Live",
        "Youth Explosion 2026",
        "Street Music Culture",
        "Moonlight Harmony"
    ];

    const artists = [
        "Hà Anh Tuấn",
        "Bích Phương",
        "Wren Evans",
        "Orange",
        "RPT MCK",
        "Obito",
        "Grey D",
        "Lâm Bảo Ngọc",
        "JSOL",
        "LyLy"
    ];

    const descriptions = [
        "Đêm nhạc hội tụ những nghệ sĩ đang được yêu thích nhất hiện nay.",
        "Sự kiện âm nhạc quy mô lớn với hàng nghìn khán giả tham dự.",
        "Không gian sân vận động bùng nổ cùng hệ thống âm thanh đỉnh cao.",
        "Chương trình mang đến những màn trình diễn độc quyền.",
        "Sự kết hợp đa thể loại từ Ballad, R&B đến HipHop.",
        "Một đêm nghệ thuật đầy cảm xúc và năng lượng."
    ];

    const randomInt = (min, max) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    const now = new Date();

    // 🎵 Tạo 50 event random
    for (let i = 0; i < 100; i++) {


        const addDays = randomInt(1, 120);
        const addHours = randomInt(18, 22);

        const start = new Date(now);
        start.setDate(start.getDate() + addDays);
        start.setHours(addHours, 0, 0, 0);

        const randomTitle = titles[randomInt(0, titles.length - 1)];
        const randomArtist = artists[randomInt(0, artists.length - 1)];
        const randomDesc = descriptions[randomInt(0, descriptions.length - 1)];

        const event = await prisma.event.create({
            data: {
                title: `${randomTitle} - ${randomArtist} #${i + 1}`,
                description: `${randomDesc} Sự góp mặt của ${randomArtist} hứa hẹn sẽ mang đến một đêm diễn bùng nổ.`,
                startTime: start,
                venueId: venue.id,
                image: `https://picsum.photos/seed/event-${i}/1200/600`
            }
        });

        await es.index({
            index: "events",
            id: event.id.toString(),
            document: {
                title: event.title,
                description: event.description,
                startTime: event.startTime,
                venue: venue.name,
                location: venue.location,
                image: event.image
            }
        })

        // 🎫 Tạo số ghế random cho mỗi event (50–150 ghế)
        const totalSeats = randomInt(50, 150);

        const seats = [];

        for (let j = 1; j <= totalSeats; j++) {
            seats.push({
                seatNumber: `A${j}`,
                price: randomInt(300000, 1000000),
                eventId: event.id
            });
        }

        await prisma.seat.createMany({
            data: seats
        });

        console.log(`Created event ${i + 1} with ${totalSeats} seats`);
    }
    await es.indices.refresh({ index: "events" });
    console.log("🔥 Seed random done!");
}

main()
    .catch(e => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });