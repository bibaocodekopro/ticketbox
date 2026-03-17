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
            name: "Công Viên Văn Hóa Đầm Sen",
            location: "Quận 11, TP. Hồ Chí Minh"
        }
    });

    const titles = [
        "Saigon Music Carnival",
        "Electric Summer Festival",
        "Chill Vibes Acoustic",
        "Urban Beat Concert",
        "City Sound Explosion",
        "Night Of The Stars",
        "Saigon Live Arena",
        "Festival Of Lights",
        "Young Talent Showcase",
        "Mega Music Party",
        "Saigon Soundwave",
        "Rhythm City Live"
    ];

    const artists = [
        "Đạt G",
        "AMEE",
        "HIEUTHUHAI",
        "tlinh",
        "Karik",
        "JSOL",
        "LyLy",
        "Vũ",
        "Obito",
        "RPT Gonzo"
    ];

    const descriptions = [
        "Sự kiện âm nhạc ngoài trời với không gian rộng lớn và sôi động.",
        "Đêm diễn quy tụ nhiều nghệ sĩ trẻ đang được yêu thích.",
        "Chương trình âm nhạc hoành tráng với hệ thống âm thanh ánh sáng hiện đại.",
        "Một đêm nhạc đầy năng lượng dành cho cộng đồng yêu âm nhạc.",
        "Sự kiện đặc biệt mang đến những màn trình diễn live bùng nổ.",
        "Không gian giải trí kết hợp âm nhạc, ánh sáng và hiệu ứng sân khấu đặc sắc."
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