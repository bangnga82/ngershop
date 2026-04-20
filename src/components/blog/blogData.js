const thumb = (name) =>
	new URL(`../../assets/blog-thumbs/${name}.svg`, import.meta.url).href;

const rawBlogData = [
	{
		id: 1001,
		slug: "cach-dung-kem-chong-nang-de-da-khoe-dep",
		title: "Cách dùng kem chống nắng để da khỏe đẹp",
		author: "NGERShop",
		date: "19/04/2026",
		summary:
			"Bôi đúng lượng, đúng thời điểm và đủ tần suất là 3 yếu tố quyết định hiệu quả bảo vệ da.",
		thumbnail:
			"https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1600&q=80",
		category: "Cách chăm sóc da",
		tags: ["chống nắng", "spf", "routine", "da khỏe"],
	},
	{
		id: 1002,
		slug: "serum-vitamin-c-dung-sao-cho-khong-kich-ung",
		title: "Serum vitamin C: dùng sao cho không kích ứng",
		author: "NGERShop",
		date: "19/04/2026",
		summary:
			"Bắt đầu từ nồng độ thấp, tăng dần và kết hợp dưỡng ẩm để da làm quen êm hơn.",
		thumbnail:
			"https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1600&q=80",
		category: "Cách chăm sóc da",
		tags: ["vitamin c", "serum", "kích ứng", "dưỡng ẩm"],
	},
	{
		id: 1003,
		slug: "6-buoc-cham-soc-da-nhay-cam-va-luu-y-quan-trong",
		title: "6 bước chăm sóc da nhạy cảm và lưu ý quan trọng",
		author: "NGERShop",
		date: "19/04/2026",
		summary:
			"Tối giản routine, ưu tiên phục hồi hàng rào bảo vệ và tránh tẩy rửa quá mạnh.",
		thumbnail:
			"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1600&q=80",
		category: "Cách chăm sóc da",
		tags: ["da nhạy cảm", "phục hồi", "routine", "dịu nhẹ"],
	},
		{
			id: 1004,
			slug: "so-sanh-3-loai-sua-rua-mat-diu-nhe-cho-da-nhay-cam",
			title: "So sánh 3 loại sữa rửa mặt dịu nhẹ cho da nhạy cảm",
		author: "NGERShop",
		date: "19/04/2026",
		summary:
			"Tập trung vào pH, chất hoạt động bề mặt và cảm giác sau rửa để chọn đúng.",
		thumbnail:
			"https://images.unsplash.com/photo-1585232351009-aa87416fca90?auto=format&fit=crop&w=1600&q=80",
			category: "Góc review",
			tags: ["sữa rửa mặt", "pH", "da nhạy cảm", "review"],
		},
		{
			id: 1006,
			slug: "review-mat-na-cap-am-dung-bao-nhieu-lan-la-du",
			title: "Review mặt nạ cấp ẩm: dùng bao nhiêu lần là đủ",
		author: "NGERShop",
		date: "19/04/2026",
		summary:
			"Dùng quá nhiều có thể phản tác dụng; quan trọng là nền routine ổn định.",
		thumbnail:
			"https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1600&q=80",
		category: "Góc review",
		tags: ["mặt nạ", "cấp ẩm", "review", "routine"],
	},
	{
		id: 1007,
		slug: "trang-diem-nen-mong-lam-sao-de-ben-va-dep",
		title: "Trang điểm nền mỏng: làm sao để bền và đẹp",
		author: "NGERShop",
		date: "19/04/2026",
		summary:
			"Chuẩn bị da kỹ, chọn base đúng loại da và dặm phấn chiến lược ở vùng chữ T.",
		thumbnail:
			"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80",
		category: "Xu hướng trang điểm",
		tags: ["makeup", "nền mỏng", "base", "trang điểm"],
	},
	{
		id: 1008,
		slug: "ma-hong-tong-am-meo-blend-tu-nhien-cho-moi-tone-da",
		title: "Má hồng tông ấm: mẹo blend tự nhiên cho mọi tone da",
		author: "NGERShop",
		date: "19/04/2026",
		summary:
			"Tán theo hướng gò má lên thái dương, ưu tiên cream blush cho độ glow.",
		thumbnail:
			"https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1600&q=80",
		category: "Xu hướng trang điểm",
		tags: ["má hồng", "blush", "glow", "makeup"],
	},
	{
		id: 1009,
		slug: "son-tint-cach-danh-long-moi-khong-bi-kho",
		title: "Son tint: cách đánh lòng môi không bị khô",
		author: "NGERShop",
		date: "19/04/2026",
		summary:
			"Dưỡng mỏng trước, bặm nhẹ và thêm lớp gloss mỏng để giữ độ ẩm.",
		thumbnail:
			"https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?auto=format&fit=crop&w=1600&q=80",
		category: "Xu hướng trang điểm",
		tags: ["son tint", "lòng môi", "dưỡng môi", "makeup"],
	},
	{
		id: 1010,
		slug: "ngu-dung-gio-thoi-quen-nho-giup-da-phuc-hoi",
		title: "Ngủ đúng giờ: thói quen nhỏ giúp da phục hồi",
		author: "NGERShop",
		date: "19/04/2026",
		summary:
			"Giấc ngủ chất lượng hỗ trợ phục hồi và giảm viêm, đặc biệt với da mụn.",
		thumbnail:
			"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1600&q=80",
		category: "Bí quyết khỏe đẹp",
		tags: ["giấc ngủ", "phục hồi", "da mụn", "thói quen"],
	},
	{
		id: 1011,
		slug: "uong-du-nuoc-hieu-dung-de-khong-ngo-nhan",
		title: "Uống đủ nước: hiểu đúng để không ngộ nhận",
		author: "NGERShop",
		date: "19/04/2026",
		summary:
			"Nước quan trọng, nhưng hàng rào bảo vệ da và dưỡng ẩm mới quyết định độ căng.",
		thumbnail:
			"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1600&q=80",
			category: "Bí quyết khỏe đẹp",
			tags: ["uống nước", "dưỡng ẩm", "hàng rào da", "thói quen"],
		},
		{
			id: 1013,
			slug: "routine-toi-gian-vi-sao-dang-duoc-ua-chuong",
			title: "Routine tối giản: vì sao đang được ưa chuộng",
		author: "NGERShop",
		date: "19/04/2026",
		summary:
			"Ít bước hơn giúp giảm kích ứng và dễ duy trì, nhất là với người mới bắt đầu.",
		thumbnail:
			"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80",
			category: "Tin tức",
			tags: ["routine", "tối giản", "skincare", "xu hướng"],
		},
		{
			id: 1,
			slug: "4-mon-do-hoa-tiet-dang-sam-de-phong-cach-tre-trung-hon",
			title: "4 món đồ họa tiết đáng sắm để phong cách trẻ trung hơn",
		author: "Nguyễn Anh Dũng",
		date: "18/11/2024",
		summary:
			"Thời trang mùa lạnh không nên chỉ giới hạn với những món đồ trơn màu. Khi bổ sung cho tủ đồ các item họa tiết, phong cách của chị em sẽ trở nên đa dạng và trẻ trung hơn.",
		thumbnail: "https://images7.alphacoders.com/138/thumbbig-1385701.webp",
		category: "Thời Trang",
		tags: ["mùa lạnh", "họa tiết", "phong cách trẻ trung"],
	},
	{
		id: 2,
		slug: "5-mon-thoi-trang-toi-gian-duoc-phu-nu-phap-dien-mai-khong-chan",
		title: "5 món thời trang tối giản được phụ nữ Pháp diện mãi không chán",
		author: "Nguyễn Anh Dũng",
		date: "18/11/2024",
		summary:
			"Thời trang tối giản nhận được sự yêu thích của nhiều chị em. Dù không quá cầu kỳ, các set đồ tối giản vẫn giúp người mặc tỏa sáng với sự tinh tế, sang trọng.",
		thumbnail:
			"https://afamilycdn.com/zoom/700_438/150157425591193600/2024/11/5/thiet-ke-chua-co-ten-2024-11-05t172525860-17308033820581694368091-0-0-500-800-crop-17308033884912040927435.jpg",
		category: "Phong Cách",
		tags: ["thời trang tối giản", "phụ nữ Pháp", "thanh lịch"],
	},
	{
		id: 3,
		slug: "4-kieu-ao-toi-gian-duoc-phu-nu-nhat-ban-yeu-thich-trong-mua-thu",
		title: "4 kiểu áo tối giản được phụ nữ Nhật Bản yêu thích trong mùa thu",
		author: "Nguyễn Anh Dũng",
		date: "18/11/2024",
		summary:
			"Phụ nữ Nhật Bản mặc đẹp nhưng họ không lên đồ quá cầu kỳ. Những món thời trang có kiểu dáng cơ bản, chuẩn một bên vững với thời gian chính là trọng tâm trong phong cách của phụ nữ Nhật.",
		thumbnail:
			"https://giadinh.mediacdn.vn/zoom/700_438/296230595582509056/2024/9/20/avatar1726802299302-17268023006441951783096.jpg",
		category: "Thời Trang",
		tags: ["áo tối giản", "phụ nữ Nhật Bản", "mùa thu"],
	},
	{
		id: 4,
		slug: "phong-cach-mua-lanh-cua-jisoo-rat-ngot-ngao-nho-4-mau-ao",
		title: "Phong cách mùa lạnh của Jisoo rất ngọt ngào nhờ 4 màu áo",
		author: "Nguyễn Anh Dũng",
		date: "18/11/2024",
		summary:
			"Jisoo (BLACKPINK) có phong cách thời trang rất đa dạng. Sang mùa lạnh, cô thường chọn những items có gam màu ngọt ngào, trẻ trung.",
		thumbnail:
			"https://afamilycdn.com/150157425591193600/2024/12/7/ngang-78-17334902215541966241337-1733535809031-17335358093282120014448.png",
		category: "Phong Cách",
		tags: ["Jisoo", "BLACKPINK", "thời trang mùa lạnh"],
	},
	{
		id: 5,
		slug: "10-cach-phoi-ao-thun-dai-tay-va-quan-jeans-tre-trung",
		title: "10 cách phối áo thun dài tay và quần jeans trẻ trung",
		author: "Nguyễn Anh Dũng",
		date: "18/11/2024",
		summary:
			"Áo thun dài tay và quần jeans là những món đồ cơ bản trong tủ đồ của mọi cô gái. Chúng có thể được phối hợp đa dạng để tạo nên những set đồ phù hợp với nhiều hoàn cảnh khác nhau.",
		thumbnail:
			"https://phunuvietnam.mediacdn.vn/zoom/320_200/179072216278405120/2024/11/15/thiet-ke-chua-co-ten-2024-11-15t165241144-17316698288152087254795.jpg",
		category: "Phong Cách",
		tags: ["áo thun dài tay", "quần jeans", "phối đồ trẻ trung"],
	},
	{
		id: 6,
		slug: "5-chuan-mac-dep-cua-phong-cach-thoi-trang-toi-gian",
		title: "5 chuẩn mặc đẹp của phong cách thời trang tối giản",
		author: "Nguyễn Anh Dũng",
		date: "18/11/2024",
		summary:
			"Phong cách thời trang tối giản đang ngày càng được yêu thích. Để mặc đẹp theo phong cách này, bạn cần nắm vững một số nguyên tắc cơ bản.",
		thumbnail:
			"https://file.hstatic.net/1000328498/article/thum_b793effcfa914d0a8fd014bb3eaec591.jpg",
		category: "Thời Trang",
		tags: ["thời trang tối giản", "chuẩn mặc đẹp", "phong cách đơn giản"],
	},
];

const getThumbNameForSlug = (slug) => {
	const s = String(slug || "").toLowerCase();
	if (s.includes("chong-nang")) return "sunscreen";
	if (s.includes("vitamin-c")) return "vitamin-c";
	if (s.includes("serum")) return "vitamin-c";
	if (s.includes("rua-mat")) return "cleanser";
	if (s.includes("kem-duong")) return "moisturizer";
	if (s.includes("barrier")) return "barrier";
	if (s.includes("phuc-hoi")) return "barrier";
	if (s.includes("mat-na")) return "mask";
	if (s.includes("tint")) return "lip-tint";
	if (s.includes("son")) return "lip-tint";
	if (
		s.includes("trang-diem") ||
		s.includes("nen-mong") ||
		s.includes("ma-hong")
	)
		return "makeup";
	if (s.includes("ngu")) return "sleep";
	if (s.includes("uong") && s.includes("nuoc")) return "water";
	if (s.includes("niacinamide")) return "niacinamide";
	if (s.includes("tay-da-chet")) return "exfoliation";
	if (s.includes("thanh-phan")) return "ingredients";
	if (s.includes("routine")) return "routine";

	// Fashion-ish slugs
	if (
		s.includes("thoi-trang") ||
		s.includes("phong-cach") ||
		s.includes("ao-") ||
		s.includes("quan-") ||
		s.includes("phoi-") ||
		s.includes("jisoo")
	)
		return "fashion";

	return "routine";
};

// Prefer explicit thumbnails from data (often external product photos).
// Only fall back to local SVG thumbs when a post doesn't specify any thumbnail.
export const blogData = rawBlogData.map((blog) => ({
	...blog,
	thumbnail: blog?.thumbnail || thumb(getThumbNameForSlug(blog.slug)),
}));

export const blogContent = {
		"cach-dung-kem-chong-nang-de-da-khoe-dep": [
			{
				type: "text",
				value:
				"Chống nắng không chỉ là bôi cho có. Để bảo vệ da hiệu quả, bạn cần bôi đủ lượng, bôi lại đúng lúc và chọn chỉ số SPF/PA phù hợp với hoàn cảnh.",
		},
		{
			type: "text",
			value:
				"Gợi ý nhanh: với mặt, lượng kem khoảng 2 ngón tay (quy ước phổ biến). Nếu hoạt động ngoài trời hoặc đổ mồ hôi nhiều, hãy bôi lại sau 2-3 giờ.",
		},
		{
			type: "image",
			value:
				"https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1600&q=80",
		},
		{
			type: "text",
			value:
				"Đừng quên các vùng hay bị bỏ sót: viền tóc, tai, cổ, gáy. Kết hợp che chắn (mũ, kính, áo) để giảm tải cho da.",
		},
	],
	"serum-vitamin-c-dung-sao-cho-khong-kich-ung": [
		{
			type: "text",
			value:
				"Vitamin C có thể giúp da sáng và đều màu, nhưng cũng dễ gây châm chích với người mới. Cách an toàn nhất là bắt đầu chậm và theo dõi phản ứng da.",
		},
		{
			type: "image",
			value:
				"https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1600&q=80",
		},
		{
			type: "text",
			value:
				"Bạn có thể dùng 2-3 lần/tuần trong 1-2 tuần đầu, sau đó tăng dần. Luôn dưỡng ẩm tốt và chống nắng kỹ vào ban ngày.",
		},
	],
	"6-buoc-cham-soc-da-nhay-cam-va-luu-y-quan-trong": [
		{
			type: "text",
			value:
				"Da nhạy cảm cần routine tối giản: làm sạch dịu nhẹ, cấp ẩm đủ, và ưu tiên phục hồi hàng rào bảo vệ trước khi thêm treatment.",
		},
		{
			type: "image",
			value:
				"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1600&q=80",
		},
		{
			type: "text",
			value:
				"Lưu ý: tránh thay nhiều sản phẩm cùng lúc. Mỗi lần chỉ thêm 1 món mới và test trước ở vùng nhỏ 2-3 ngày.",
		},
	],
	"so-sanh-3-loai-sua-rua-mat-diu-nhe-cho-da-nhay-cam": [
		{
			type: "text",
			value:
				"Với da nhạy cảm, sữa rửa mặt lý tưởng là loại làm sạch vừa đủ, ít hương liệu, không để lại cảm giác căng rít sau rửa.",
		},
		{
			type: "image",
			value:
				"https://images.unsplash.com/photo-1585232351009-aa87416fca90?auto=format&fit=crop&w=1600&q=80",
		},
		{
			type: "text",
			value:
				"Hãy ưu tiên: pH cân bằng, chất hoạt động bề mặt dịu, và có thành phần làm dịu (panthenol, allantoin).",
		},
		],
		"review-mat-na-cap-am-dung-bao-nhieu-lan-la-du": [
			{
				type: "text",
				value:
				"Mặt nạ cấp ẩm nên là “topping” chứ không thay thế dưỡng ẩm hằng ngày. Thường 2-3 lần/tuần là đủ với đa số loại da.",
		},
		{
			type: "image",
			value:
				"https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1600&q=80",
		},
		{
			type: "text",
			value:
				"Nếu dùng quá dày/ quá lâu có thể gây bí hoặc kích ứng. Luôn khóa ẩm bằng kem dưỡng sau khi đắp.",
		},
	],
	"trang-diem-nen-mong-lam-sao-de-ben-va-dep": [
		{
			type: "text",
			value:
				"Nền mỏng đẹp phụ thuộc 70% ở bước prep da. Hãy dưỡng ẩm vừa đủ và dùng primer đúng vùng cần kiểm soát dầu.",
		},
		{
			type: "image",
			value:
				"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80",
		},
		{
			type: "text",
			value:
				"Đánh nền mỏng theo lớp: mỏng -> che khuyết điểm điểm -> phủ phấn chiến lược vùng chữ T để bền hơn.",
		},
	],
	"ma-hong-tong-am-meo-blend-tu-nhien-cho-moi-tone-da": [
		{
			type: "text",
			value:
				"Má hồng tông ấm dễ hợp nhiều tone da và tạo cảm giác khỏe. Hãy tán từ gò má lên thái dương để gương mặt gọn hơn.",
		},
		{
			type: "image",
			value:
				"https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1600&q=80",
		},
		{
			type: "text",
			value:
				"Nếu dùng cream blush, đặt nhẹ rồi tán bằng mút ẩm để lớp phấn mịn và tự nhiên.",
		},
	],
	"son-tint-cach-danh-long-moi-khong-bi-kho": [
		{
			type: "text",
			value:
				"Để son tint không bị khô, hãy dưỡng mỏng trước 3-5 phút, lau bớt dư rồi mới apply son.",
		},
		{
			type: "image",
			value:
				"https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?auto=format&fit=crop&w=1600&q=80",
		},
		{
			type: "text",
			value:
				"Kỹ thuật đánh lòng môi: chấm son ở trong, bặm nhẹ và tán viền bằng tay sạch/cọ. Có thể phủ gloss mỏng để giữ ẩm.",
		},
	],
	"ngu-dung-gio-thoi-quen-nho-giup-da-phuc-hoi": [
		{
			type: "text",
			value:
				"Ngủ đúng giờ giúp giảm stress hormone và hỗ trợ phục hồi da. Nếu thiếu ngủ, da thường xỉn màu và dễ lên mụn hơn.",
		},
		{
			type: "image",
			value:
				"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1600&q=80",
		},
		{
			type: "text",
			value:
				"Hãy thử: cố định giờ ngủ, giảm caffeine sau 14:00, và hạn chế màn hình trước khi ngủ 30 phút.",
		},
	],
	"uong-du-nuoc-hieu-dung-de-khong-ngo-nhan": [
		{
			type: "text",
			value:
				"Uống nước giúp cơ thể hoạt động tốt, nhưng da căng mịn vẫn cần hàng rào bảo vệ khỏe và dưỡng ẩm đúng cách.",
		},
		{
			type: "image",
			value:
				"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1600&q=80",
		},
		{
			type: "text",
			value:
				"Nếu da khô bong, hãy kiểm tra lại sữa rửa mặt, thêm serum/kem dưỡng phù hợp và khóa ẩm tốt vào buổi tối.",
		},
		],
		"routine-toi-gian-vi-sao-dang-duoc-ua-chuong": [
			{
				type: "text",
				value:
				"Routine tối giản giúp giảm rủi ro kích ứng và dễ duy trì. Đặc biệt phù hợp với người mới bắt đầu hoặc da đang yếu.",
		},
		{
			type: "image",
			value:
				"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80",
		},
		{
			type: "text",
			value:
				"Cốt lõi vẫn là 3 bước: làm sạch dịu nhẹ, dưỡng ẩm và chống nắng. Các hoạt chất nên thêm dần theo mục tiêu.",
			},
		],
		"4-mon-do-hoa-tiet-dang-sam-de-phong-cach-tre-trung-hon": [
			{
				type: "text",
				value: "Thời trang mùa lạnh không nên chỉ giới hạn với những món đồ trơn màu. Khi bổ sung cho tủ đồ các item họa tiết, phong cách của chị em sẽ trở nên đa dạng và trẻ trung hơn. Một số món thời trang họa tiết đáng sắm trong mùa lạnh này.",
		},
		{
			type: "image",
			value: "https://phunuvietnam.mediacdn.vn/179072216278405120/2024/11/8/3778541651787501785738504720959516477802200n-17310660936821205254966.jpg",
		},
		{
			type: "text",
			value: "Các thiết kế họa tiết mang đến sự tươi mới và năng động cho phong cách mùa đông. Chúng giúp bạn nổi bật và thu hút ánh nhìn, đồng thời tạo điểm nhấn cho tổng thể trang phục.",
		},
		{
			type: "image",
			value: "https://phunuvietnam.mediacdn.vn/179072216278405120/2024/11/8/875424016450429429825195480447033524422728n-1731066124538164456511.jpg",
		},
	],
	"5-mon-thoi-trang-toi-gian-duoc-phu-nu-phap-dien-mai-khong-chan": [
		{
			type: "text",
			value: "Thời trang tối giản nhận được sự yêu thích của nhiều chị em. Dù không quá cầu kỳ, các set đồ tối giản vẫn giúp người mặc tỏa sáng với sự tinh tế, sang trọng. Phong cách tối giản rất dễ áp dụng, đồng thời giúp bạn tiết kiệm thời gian khi phối đồ mà vẫn đảm bảo được vẻ ngoài chỉn chu.",
		},
		{
			type: "image",
			value: "https://motcuocsong.vn/wp-content/uploads/2024/11/1308238922113046738537817883587305726031107n-16088054707711009794511.jpg",
		},
		{
			type: "text",
			value: "Phụ nữ Pháp nổi tiếng với phong cách thời trang thanh lịch, tinh tế và không bao giờ lỗi thời. Họ chọn những món đồ cơ bản nhưng chất lượng, các thiết kế có thể mặc được nhiều năm mà không lỗi mốt.",
		},
		{
			type: "image",
			value: "https://motcuocsong.vn/wp-content/uploads/2024/11/ao-Blazer-1-768x614.jpg",
        },
        {
            type: "text",
            value: "Hãy thử kết hợp áo trench coat với áo sáng màu bên trong và quần jeans để tạo nên vẻ ngoài trẻ trung, hiện đại. Nếu muốn thêm phần duyên dáng, một chiếc váy xẻ tà cùng đôi boots cổ thấp sẽ là lựa chọn hoàn hảo."
        }
	],
	"4-kieu-ao-toi-gian-duoc-phu-nu-nhat-ban-yeu-thich-trong-mua-thu": [
		{
			type: "text",
			value: "Phụ nữ Nhật Bản mặc đẹp nhưng họ không lên đồ quá cầu kỳ. Những món thời trang có kiểu dáng cơ bản, chuẩn một bên vững với thời gian chính là trọng tâm trong phong cách của phụ nữ Nhật. Đây chính là lý do, những kiểu áo tối giản luôn được ưa chuộng trong tủ đồ của họ.",
		},
		{
			type: "image",
			value: "https://afamilycdn.com/150157425591193600/2024/9/19/4390939173441931115223874658073724593888689n-17267443647331622863494.jpg",
		},
		{
			type: "text",
			value: "Phong cách thời trang của phụ nữ Nhật Bản thường đề cao sự tinh giản, thanh lịch và thực dụng. Họ ưu tiên những thiết kế có tính ứng dụng cao, dễ phối đồ và phù hợp với nhiều hoàn cảnh khác nhau.",
		},
		{
			type: "image",
			value: "https://afamilycdn.com/150157425591193600/2024/9/19/430873869373320275487689175362457102924940n-1726744382666219713382.jpg",
		},
	],
	"phong-cach-mua-lanh-cua-jisoo-rat-ngot-ngao-nho-4-mau-ao": [
		{
			type: "text",
			value: "Jisoo (BLACKPINK) có phong cách thời trang rất đa dạng. Sang mùa lạnh, cô thường chọn những items có gam màu ngọt ngào, trẻ trung. Những gam màu này giúp Jisoo ghi điểm với vẻ ngoài xinh xắn, nữ tính.",
		},
		{
			type: "image",
			value: "https://afamilycdn.com/150157425591193600/2024/12/7/14-17334762928021725445033-1733535814765-173353581488578291829.jpg",
		},
		{
			type: "text",
			value: "Phong cách thời trang mùa đông của Jisoo thường xoay quanh những gam màu pastel nhẹ nhàng, tạo cảm giác ấm áp và ngọt ngào. Cô thường kết hợp áo len, cardigan với các phụ kiện đơn giản để hoàn thiện set đồ.",
		},
		{
			type: "image",
			value: "https://afamilycdn.com/150157425591193600/2024/12/7/edit-16-173347652071898656709-1733535816478-17335358165831722976319.jpeg",
		},
		{
			type: "text",
			value: "Mũ beret sở hữu đa dạng màu sắc và hoạ tiết, nên dù Jisoo chuộng tông đen nhưng vẫn nhiều lần ưu ái những tông màu rực rỡ khác, điển hình là: đỏ, xanh coban, hoạ tiết kẻ caro... Phải công nhận rằng mỹ nhân đẹp nhất thế giới sưu tầm cực nhiều mũ beret, trang phục theo phong cách nào cô cũng có thể phối cùng item này.",
		},
	],
	"10-cach-phoi-ao-thun-dai-tay-va-quan-jeans-tre-trung": [
		{
			type: "text",
			value: "Áo thun dài tay và quần jeans là những món đồ cơ bản trong tủ đồ của mọi cô gái. Chúng có thể được phối hợp đa dạng để tạo nên những set đồ phù hợp với nhiều hoàn cảnh khác nhau. Dưới đây là 10 cách phối đồ trẻ trung, năng động với áo thun dài tay và quần jeans.",
		},
		{
			type: "image",
			value: "https://phunuvietnam.mediacdn.vn/thumb_w/860/179072216278405120/2024/11/15/456374368183684505601037493599211321051137500n-17316698993621858069451.jpg",
		},
		{
			type: "text",
			value: "Sự kết hợp giữa áo thun dài tay và quần jeans mang đến vẻ ngoài năng động, trẻ trung nhưng vẫn không kém phần phong cách. Bạn có thể biến tấu với nhiều kiểu áo thun và quần jeans khác nhau để tạo nên phong cách riêng của mình.",
		},
		{
			type: "image",
			value: "https://phunuvietnam.mediacdn.vn/thumb_w/860/179072216278405120/2024/11/15/4609883868864327896223055439014498842396494n-17316699681462086573809.jpg",
		},
	],
	"5-chuan-mac-dep-cua-phong-cach-thoi-trang-toi-gian": [
		{
			type: "text",
			value: "Phong cách tối giản được nhiều chị em ưa chuộng vì không tốn nhiều công sức, thời gian lên đồ, nhưng vẫn hoàn thiện được outfit sành điệu. Ngoài ra, phong cách tối giản còn không bao giờ lỗi mốt, bạn có thể áp dụng từ năm này qua năm khác",
		},
		{
			type: "image",
			value: "https://kenh14cdn.com/thumb_w/660/203336854389633024/2023/2/16/photo-6-1676513996396310743460.jpg",
		},
		{
			type: "text",
			value: "Quần âu không chỉ là món thời trang phù hợp với môi trường công sở, mà còn lý tưởng để diện đi dạo phố cuối tuần. Quần âu có sự đan xen giữa nét thanh lịch và vẻ phóng khoáng, hiện đại. Kiểu quần này không hề cầu kỳ, nên là lựa chọn lý tưởng mỗi khi bạn muốn diện đồ tối giản.",
		},
		{
			type: "image",
			value: "https://kenh14cdn.com/thumb_w/660/203336854389633024/2023/2/16/photo-5-1676513993040125476715.jpg",
		},
		{
			type: "text",
			value: "Giày đen là thiết kế không thể thiếu trong tủ đồ tối giản. Vì mang tông màu trung tính, giày đen có thể ăn nhập với hầu hết mọi kiểu trang phục. Chưa kể, giày đen còn cộng thêm điểm sang trọng và tinh tế cho người diện. Nếu đi giày bệt, bạn nên chọn quần dài trên mắt cá chân hoặc chân váy midi để đảm bảo vẻ cao ráo, thanh thoát cho vóc dáng.",
		},
	],
};

export const categories = [
	{ name: "Thời Trang", count: 2 },
	{ name: "Phong Cách", count: 3 },
	{ name: "Xu Hướng", count: 0 },
];

export const popularTags = [
	{ name: "mùa lạnh", count: 3 },
	{ name: "tối giản", count: 2 },
	{ name: "phong cách trẻ trung", count: 2 },
	{ name: "phụ nữ Pháp", count: 1 },
	{ name: "phụ nữ Nhật Bản", count: 1 },
	{ name: "BLACKPINK", count: 1 },
	{ name: "Jisoo", count: 1 },
];
