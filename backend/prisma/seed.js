const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

    const venue = await prisma.venue.create({
        data: {
            name: "Sân Vận Động Sài Gòn",
            location: "TP. Hồ Chí Minh"
        }
    });

    const titles = [
        "Đêm Nhạc Mùa Xuân",
        "Live Concert Sương Mai",
        "Đại Nhạc Hội Mùa Hè",
        "Acoustic Chill Cuối Tuần",
        "Rock Bùng Nổ 2026",
        "Đêm Jazz & Rượu Vang",
        "Chill Lo-fi Tối Thứ 7",
        "Hòa Nhạc Cổ Điển",
        "Open Air Festival",
        "DJ Night Countdown",
        "Indie Showcase Việt",
        "Đêm Nhạc Hoài Niệm 8x 9x"
    ];

    const artists = [
        "Sơn Tùng M-TP",
        "Hà Anh Tuấn",
        "Vũ.",
        "Tóc Tiên",
        "Đen Vâu",
        "Min",
        "Noo Phước Thịnh",
        "Hoàng Dũng",
        "Da LAB",
        "Chillies"
    ];

    const descriptions = [
        "Một đêm nhạc đầy cảm xúc với những bản hit được yêu thích nhất.",
        "Sự kiện âm nhạc hoành tráng với hệ thống âm thanh và ánh sáng đỉnh cao.",
        "Không gian âm nhạc ngoài trời cực chill dành cho giới trẻ.",
        "Trải nghiệm âm nhạc sống động cùng nghệ sĩ hàng đầu Việt Nam.",
        "Đêm diễn đặc biệt chỉ tổ chức duy nhất một lần trong năm.",
        "Hòa mình vào không khí sôi động cùng hàng ngàn khán giả."
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

    console.log("🔥 Seed random done!");
}

main();