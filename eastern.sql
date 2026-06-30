-- ==========================================================
-- 东方朗月 (Eastern Bright Moon) 数据库物理备份 SQL 转储 (MySQL 规格)
-- 备份说明: 本文件是一个 100% 独立且闭环的建库、建表及数据初始化恢复文件。
-- 迁移指南: 直接导入本文件，即可在一秒内从零重建库表并填装全部美丽数据。
-- 导出机制: Python 纯异步高兼容性数据内省导出器 (SHOW CREATE TABLE)
-- 导出时间: 2026-06-11
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `eastern` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `eastern`;

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '管理员唯一登录账户名',
  `hashed_password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'bcrypt哈希加密后的安全密码密文',
  `is_active` tinyint(1) NOT NULL COMMENT '账户是否激活启用',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_users_username` (`username`),
  KEY `ix_users_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统后台安全管理员账户表';

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` (`id`, `username`, `hashed_password`, `is_active`) VALUES (1, 'admin', '$2b$12$tc0d2oJD/a2zU20/TsaIBOgCkkbCR/NmHnBhGGLwWhhEWEyOouW7e', 1);


-- ----------------------------
-- Table structure for personal_bio
-- ----------------------------
DROP TABLE IF EXISTS `personal_bio`;
CREATE TABLE `personal_bio` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键ID',
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '艺术家中文名称',
  `name_en` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '艺术家英文翻译名',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '主打核心头衔/方向标签',
  `motto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '座右铭诗句/核心宣言',
  `intro_paragraphs` json DEFAULT NULL COMMENT '多段落自我经历介绍的文字数组',
  `cover_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '自述右侧封面宣传大图链接',
  PRIMARY KEY (`id`),
  KEY `ix_personal_bio_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='艺术家个人美学自述简介表';

-- ----------------------------
-- Records of personal_bio
-- ----------------------------
INSERT INTO `personal_bio` (`id`, `name`, `name_en`, `title`, `motto`, `intro_paragraphs`, `cover_image`) VALUES (1, '东方朗月', 'Eastern Bright Moon', '文化传播、故事倾听、美的发现', '星河万里映神州，清风朗月照归人。', '["我是东方朗月。一个在文化中漫步、在日常中记录的行者。生活、摄影与手作，皆是我探寻何为人生的媒介。", "艺术如明月高照，润物无声。", "它来源于自然与生活、远古与未来，", "把实际物质浓缩为抽象的符号，", "把虚无的美感投射在日常的角落。", "在这段长途跋涉的旅程中，", "我们收集各种各样的碎片，企图找到心灵的归宿。", "For Free。"]', 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80');


-- ----------------------------
-- Table structure for exhibition_reviews
-- ----------------------------
DROP TABLE IF EXISTS `exhibition_reviews`;
CREATE TABLE `exhibition_reviews` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '展览点评唯一标识ID',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '展评文章主标题',
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '展评文章副标题',
  `artist` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '参展艺术家名称/联展主旨',
  `gallery_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '美术馆/画廊等展览地点空间名称',
  `date` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '看展或撰写发布日期(如2025.10)',
  `rating` float NOT NULL COMMENT '展览推荐评分指数(0.0-5.0)',
  `review_text` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '展评详细体验感受多段文字',
  `poster_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '展览官方实体海报图链接',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='艺术空间/画廊展览看展点评手记表';

-- ----------------------------
-- Records of exhibition_reviews
-- ----------------------------
INSERT INTO `exhibition_reviews` (`id`, `title`, `subtitle`, `artist`, `gallery_name`, `date`, `rating`, `review_text`, `poster_url`) VALUES ('review-1', '空 & 间：白石与黑泥的重构', 'Void and Form: Reconstruction of White Stone & Black Clay', '当代极简器物群展', '三影堂摄影艺术中心 Three Shadows', '2025.10', 5.0, '展览以朴拙的黏土器物与留白的黑白摄影共同构筑了‘无声之歌’。漫步在展厅，仿佛置身于一块巨大的宣纸画布。黑泥沉重，吸收了周围的杂音，流露出一种大地的孤寂；而白色的莱姆石器皿却在顶光下异常轻薄，折射着柔和的时间质感。两者在空荡的灰墙空间里无声咬合，不需要多余的文字导览，就像深切而漫长的呼吸，让躁动的心归于安息。', 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80');
INSERT INTO `exhibition_reviews` (`id`, `title`, `subtitle`, `artist`, `gallery_name`, `date`, `rating`, `review_text`, `poster_url`) VALUES ('review-2', '光影切片：寂夜之美', 'Slices of Light: The Beauty of Quiet Night', '中日艺术家手作光影设计联展', '上海当代艺术博物馆 Power Station of Art', '2025.12', 4.8, '用旧工业厂房巨大的硬质钢筋和水泥黑暗，来承载最微小的、飘摇的手工光影，这个展览的设计本身就是一首宏大的建筑诗。展览的核心是在一个漆黑的长廊中，两排手工和纸灯笼与二十几盏正在静静燃烧的手工蜂蜡。冷硬的混凝土结构与温暖和煦的明火撞击，让人切实感受到即便再脆弱、卑微的闪烁，也在用温暖的光芒努力雕刻着空间那令人窒息的广阔与深邃。', 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=600&q=80');
INSERT INTO `exhibition_reviews` (`id`, `title`, `subtitle`, `artist`, `gallery_name`, `date`, `rating`, `review_text`, `poster_url`) VALUES ('review-3', '无声的漫涉：流变之印', 'Silent Diffusion: Changing Prints on Mulberry Paper', '当代水墨艺术家个展', '木木美术馆 M WOODS Museum', '2026.03', 4.9, '极富张力的是，每一幅悬挂在大堂的宣纸上的水墨画都在随着展厅内微妙的温度和湿度变化，进行极其微弱的扩散，时间在这里被具象化，变得肉眼可见。展厅中心设置了一尊青铜制的流线型熏香炉，白檀的烟气在投射的高光中升腾变幻，和白壁上的淡墨黑痕产生了精妙的太极呼应，完成了关于‘空’与‘满’、‘动’与‘静’的双向哲理阐释。', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80');
INSERT INTO `exhibition_reviews` (`id`, `title`, `subtitle`, `artist`, `gallery_name`, `date`, `rating`, `review_text`, `poster_url`) VALUES ('review-4', '归去来：荒野与木作之息', 'The Return: Whispers of Wilderness & Woodcraft', '北欧与东方原木设计师特展', '例外艺术中心 Exception Art Center', '2026.05', 4.7, '展览在开阔的挑高展厅中陈列了一批不经刻意雕饰的古老原木器物。有些木件上还保留着当年森林火灾残留的焦黑痕迹。指尖抚摸着粗糙的树轮，好似在与百年前的一棵松木低声私语。空间中飘荡着轻柔的百里香与广藿香的气息，令每一位步入展厅的都市行者都能瞬间卸下重担，重新找回归于自然的平静。', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80');


-- ----------------------------
-- Table structure for photo_items
-- ----------------------------
DROP TABLE IF EXISTS `photo_items`;
CREATE TABLE `photo_items` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '摄影作品唯一标识ID',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '摄影作品艺术标题',
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '摄影所属分类过滤标签(如草木/景观/城市)',
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '拍摄具体地理位置',
  `date` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '拍摄/冲洗发布日期',
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '作品原片高清图片存储链接',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT '作品配套的诗意配文/摄影感言',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='镜头光影画廊原创摄影作品表';

-- ----------------------------
-- Records of photo_items
-- ----------------------------
INSERT INTO `photo_items` (`id`, `title`, `category`, `location`, `date`, `image_url`, `description`) VALUES ('photo-1', '古刹竹影', '草木', '京都 · 岚山', '2024.11', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', '古刹的木廊之下，清晨的金线金光刺透了层叠的树梢。清风微拂，竹影在斑驳的素白纸门上被拉得极大、极长。影子微微晃动，那一瞬，喧嚣的岚山瞬间静音，只留下光影在无声跳舞。');
INSERT INTO `photo_items` (`id`, `title`, `category`, `location`, `date`, `image_url`, `description`) VALUES ('photo-2', '微茫清流', '景观', '温州 · 楠溪江', '2025.02', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80', '阴郁的寒冬，溪水泛着铅灰色的清冷。泛舟江上，只有午后重云偶然撕裂的那一秒，一整道纯净天光劈入水面。原本暗淡的卵石底骤然亮如黄金，那一刻，仿佛瞥见了尘世之外的秘密通道。');
INSERT INTO `photo_items` (`id`, `title`, `category`, `location`, `date`, `image_url`, `description`) VALUES ('photo-3', '林深宿雾', '草木', '青城山 · 幽道', '2025.04', 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80', '细雨过后的山林，弥漫着松针落叶和草本植物特有的润泽气息。山岚薄雾从谷底深处慢腾腾地浮上来，将笔挺挺的参天红杉淹没大半，四周只留下一片极致的幽绿与水墨晕染般的寂寥。');
INSERT INTO `photo_items` (`id`, `title`, `category`, `location`, `date`, `image_url`, `description`) VALUES ('photo-4', '沧浪微光', '景观', '舟山 · 离岛', '2024.08', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80', '退潮前的薄暮，海天处于同一层暧昧的冷蓝。渔排与碎浪在晦暗中沉寂，只有最边缘处的沙滩，在一层细腻的泡沫折射下，残留着最后一丝微弱却璀璨的日落余辉。');
INSERT INTO `photo_items` (`id`, `title`, `category`, `location`, `date`, `image_url`, `description`) VALUES ('photo-5', '青空之寂', '景观', '川西 · 贡嘎八郎生都', '2025.09', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', '在海拔四千两百米的原野上。风像刀一样刮过，荒原寂寂。那座巨大的雪白色峰群在宝蓝的晴空下如巍峨的君王，俯瞰着尘世间的聚散与渺小，令人不禁屏住呼吸，重拾对天地的崇敬。');
INSERT INTO `photo_items` (`id`, `title`, `category`, `location`, `date`, `image_url`, `description`) VALUES ('photo-6', '城市暖光', '城市', '上海 · 弄堂深处', '2026.01', 'https://images.unsplash.com/photo-1542156822-6924d1a71aba?auto=format&fit=crop&w=1200&q=80', '梧桐枯枝投射在红砖洋房的墙面。老弄堂转角，一盏昏黄路灯悄然亮起，给寒风中行色匆匆的归人添了一抹和暖。喧嚣的城市在此退去底噪，只剩下最质朴的温存陪伴身侧。');


-- ----------------------------
-- Table structure for footprint_items
-- ----------------------------
DROP TABLE IF EXISTS `footprint_items`;
CREATE TABLE `footprint_items` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '足迹标点唯一标识ID',
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '目的地城市中文名称',
  `city_en` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '目的地城市英文翻译名',
  `country` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '目的地所属国家/政区名称',
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '具体名胜古迹或旅程地标',
  `x` float NOT NULL COMMENT '地图背景中相对横向百分比坐标X(0-100)',
  `y` float NOT NULL COMMENT '地图背景中相对纵向百分比坐标Y(0-100)',
  `date` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '旅程时间日期标签',
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '该足迹精美实景渲染大图链接',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT '足迹故事与旅行感悟手记',
  `region` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '所属中国地理分区/境外国家区域',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='寰宇足迹旅行定点地图坐标表';

-- ----------------------------
-- Records of footprint_items
-- ----------------------------
INSERT INTO `footprint_items` (`id`, `city`, `city_en`, `country`, `location`, `x`, `y`, `date`, `image_url`, `description`, `region`) VALUES ('fp-beijing', '北京', 'Beijing', '中国', '故宫 · 角楼', 53.0, 24.0, '2023.10', 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1200&q=80', '北平之秋，最在角楼落日。深秋的银杏落了一地，微红的古城墙上映着金灿灿的光晕。老胡同深处传来袅袅的白鸽宿鸣，那是浩大都城中最温存的褶皱。', '华北');
INSERT INTO `footprint_items` (`id`, `city`, `city_en`, `country`, `location`, `x`, `y`, `date`, `image_url`, `description`, `region`) VALUES ('fp-dunhuang', '敦煌', 'Dunhuang', '中国', '鸣沙山 · 莫高窟', 22.0, 24.0, '2025.09', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', '大漠孤烟。鸣沙山的风，能吹平黄沙上的足迹，却吹不散莫高窟中无声端坐了千年的泥塑。落日把无边起伏的沙海染成一片瑰红，那一刻，天地之高远，令人热泪盈眶。', '西北');
INSERT INTO `footprint_items` (`id`, `city`, `city_en`, `country`, `location`, `x`, `y`, `date`, `image_url`, `description`, `region`) VALUES ('fp-fuzhou', '福州', 'Fuzhou', '中国', '三坊七巷 · 榕堂', 60.0, 65.0, '2024.04', 'https://images.unsplash.com/photo-1520121401995-928cd50d4e27?auto=format&fit=crop&w=1200&q=80', '三坊七巷的粉墙黛瓦，在海滨独有的潮湿清晨中显得异常温润。白色的马鞍墙上，巨大的百年榕树将气根低低垂下。微风掠过天台，茉莉花茶温热的气氛在空气里静静盘旋。', '华东');
INSERT INTO `footprint_items` (`id`, `city`, `city_en`, `country`, `location`, `x`, `y`, `date`, `image_url`, `description`, `region`) VALUES ('fp-guangzhou', '广州', 'Guangzhou', '中国', '沙面 · 欧陆建筑群', 48.0, 74.0, '2025.11', 'https://images.unsplash.com/photo-1525183995015-779fb58fb4cf?auto=format&fit=crop&w=1200&q=80', '沙面参天的古樟下，斑驳的欧式小黄楼在午后折光里浮雕般凸显。叹一盏一盅两件的晨茶，听着周围温吞的粤语寒暄，岭南的生活哲学全在这杯微微发涩的铁观音里了。', '大湾区');
INSERT INTO `footprint_items` (`id`, `city`, `city_en`, `country`, `location`, `x`, `y`, `date`, `image_url`, `description`, `region`) VALUES ('fp-hangzhou', '杭州', 'Hangzhou', '中国', '西湖 · 梅家坞', 62.0, 53.0, '2025.05', 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80', '烟雨两茫茫，西湖里的扁舟如水墨点缀在茫茫碧流中。远山含黛，像极了宣纸上淡淡的擦痕。在梅家坞的深谷里，听细雨打湿竹叶，空气中尽是清新的草本茶香。', '华东');
INSERT INTO `footprint_items` (`id`, `city`, `city_en`, `country`, `location`, `x`, `y`, `date`, `image_url`, `description`, `region`) VALUES ('fp-kyoto', '京都', 'Kyoto', '日本', '岚山 · 苔之殿堂', 85.0, 39.0, '2024.11', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', '古刹的木廊之下，清晨的金线阳光刺透了层叠的枫梢。细雨微拂，深浅不一的青苔在湿润的黑石缝中默默呼吸。影子微微晃动，那一瞬，喧嚣退场，灵魂归宁。', '日本');
INSERT INTO `footprint_items` (`id`, `city`, `city_en`, `country`, `location`, `x`, `y`, `date`, `image_url`, `description`, `region`) VALUES ('fp-shanghai', '上海', 'Shanghai', '中国', '淮海中路 · 步高里', 64.0, 50.0, '2026.01', 'https://images.unsplash.com/photo-1542156822-6924d1a71aba?auto=format&fit=crop&w=1200&q=80', '法租界的老房红砖，在枯尽的梧桐影里带着一丝欧式的慵懒。老弄堂的长椅、洗旧的单车、以及街角正飘着檀木气味的手工香薰店，汇聚成了魔都最内敛的日常切面。', '华东');
INSERT INTO `footprint_items` (`id`, `city`, `city_en`, `country`, `location`, `x`, `y`, `date`, `image_url`, `description`, `region`) VALUES ('fp-shanwei', '汕尾', 'Shanwei', '中国', '红海湾 · 暗礁岩岸', 53.0, 76.5, '2025.11', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80', '红海湾的风，带着咸涩的咆哮。纯净而暴烈的浪墙拍击着千百年来巍然矗立的黑色巨石，砸出泼天的大泡，瞬间将天地染成了纯粹的墨色与胜霜，尽显沧海的孤独与野性。', '大湾区');
INSERT INTO `footprint_items` (`id`, `city`, `city_en`, `country`, `location`, `x`, `y`, `date`, `image_url`, `description`, `region`) VALUES ('fp-shenzhen', '深圳', 'Shenzhen', '中国', '深圳湾 · 红树林', 49.0, 77.0, '2025.11', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80', '红树林畔清音。黑脸琵鹭贴着泛冷光的蓝色水面平滑掠过，而身后的岸边，是高达数百米的透明光纤硅谷立面。在这里，科技的高度发达，最终和最原始的自然生态安静共存。', '大湾区');
INSERT INTO `footprint_items` (`id`, `city`, `city_en`, `country`, `location`, `x`, `y`, `date`, `image_url`, `description`, `region`) VALUES ('fp-tianjin', '天津', 'Tianjin', '中国', '解放桥 · 海河畔', 55.0, 27.0, '2023.10', 'https://images.unsplash.com/photo-1547984609-445a477329d4?auto=format&fit=crop&w=1200&q=80', '薄暮笼罩海河。百年解放桥的铁架立柱，在西洋钟楼和暖黄霓虹里展现出舒展的工业几何。河水潺潺流动，仿佛带着津门古老的烟火气，缓缓流入没有声音的浩荡海洋。', '华北');
INSERT INTO `footprint_items` (`id`, `city`, `city_en`, `country`, `location`, `x`, `y`, `date`, `image_url`, `description`, `region`) VALUES ('fp-tokyo', '东京', 'Tokyo', '日本', '新宿 · 步道天桥', 91.0, 37.0, '2024.11', 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=1200&q=80', '在新宿黄昏的楼群缝隙中，看橘红色的电车发出规律的摩擦声穿过天桥。四周人流如鲫，却让人在高度秩序的都市峡谷中，体会到一种最谦卑而安静的寂寞。', '日本');
INSERT INTO `footprint_items` (`id`, `city`, `city_en`, `country`, `location`, `x`, `y`, `date`, `image_url`, `description`, `region`) VALUES ('fp-wuhan', '武汉', 'Wuhan', '中国', '长江大桥 · 蛇山', 49.0, 52.0, '2024.12', 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1200&q=80', '冬日江城，薄雾漫天。大桥下江水混浊奔腾，带着楚地粗狂的张力。江汉关传来的宏亮钟声震动着浓雾中过往的渡轮，街角那一碗热气腾腾的热干面锅炉，是这里最踏实的尊严。', '华中');
INSERT INTO `footprint_items` (`id`, `city`, `city_en`, `country`, `location`, `x`, `y`, `date`, `image_url`, `description`, `region`) VALUES ('fp-zhongshan', '中山', 'Zhongshan', '中国', '石岐 · 老街骑楼', 46.5, 76.5, '2025.11', 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80', '歧江桥畔。石岐老街的灰泥骑楼上带着风雨打磨而出的细腻苔痕。午后阵雨不期而至，雨水顺着雕花的下水管汇入下水道，慢节奏的生活在这片榕树绿荫下永不过时。', '大湾区');
INSERT INTO `footprint_items` (`id`, `city`, `city_en`, `country`, `location`, `x`, `y`, `date`, `image_url`, `description`, `region`) VALUES ('fp-zhuhai', '珠海', 'Zhuhai', '中国', '情侣路 · 爱情邮筒', 45.5, 78.0, '2025.11', 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80', '南海之滨。暖湿的海风扑面而来，港珠澳大桥如同一条穿行在水墨云霭中的巨龙潜入天际。浪头一次次在坚硬的防波堤上揉碎，潮声呢喃，将这极美的蔚蓝之夜缓缓催眠。', '大湾区');


-- ----------------------------
-- Table structure for zen_quotes
-- ----------------------------
DROP TABLE IF EXISTS `zen_quotes`;
CREATE TABLE `zen_quotes` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '语录唯一标识ID',
  `text` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '侘寂语录正文内容',
  `author` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '匿名' COMMENT '语录原作者或古籍出处',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='禅意侘寂哲学名言名句语录表';

-- ----------------------------
-- Records of zen_quotes
-- ----------------------------
INSERT INTO `zen_quotes` (`id`, `text`, `author`) VALUES ('zq-1', '万物皆有裂痕，那是光照进来的地方。', '莱昂纳德 · 科恩');
INSERT INTO `zen_quotes` (`id`, `text`, `author`) VALUES ('zq-2', '人生的起头与落幕，往往和朔夜一样，最安静、也最广博。', '东方朗月');
INSERT INTO `zen_quotes` (`id`, `text`, `author`) VALUES ('zq-3', '江流有声，断岸千尺；山高月小，水落石出。', '苏轼');
INSERT INTO `zen_quotes` (`id`, `text`, `author`) VALUES ('zq-4', '无一物中无尽藏，有花有月有楼台。', '禅宗偈语');
INSERT INTO `zen_quotes` (`id`, `text`, `author`) VALUES ('zq-5', '光即使微弱如丝，在十足的黑暗中也是不可分割的庞然大物。', '空间漫行手记');
INSERT INTO `zen_quotes` (`id`, `text`, `author`) VALUES ('zq-6', '回归最朴实的器物、最轻曼的草木香，便是对浮躁生活最坚毅的自审。', '东方朗月');


-- ----------------------------
-- Table structure for column_issues
-- ----------------------------
DROP TABLE IF EXISTS `column_issues`;
CREATE TABLE `column_issues` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '期刊唯一标识ID(如issue-1)',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '杂志主刊大栏目名称',
  `issue_no` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '期刊编号期数(如第一期)',
  `issue_title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '期刊专属美学主题名(如朔)',
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '期刊副标题副说明',
  `date` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '出版/发布时间日期(如2025.04)',
  `main_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '期刊大封面海报图链接',
  `summary` text COLLATE utf8mb4_unicode_ci COMMENT '期刊摘要导读文本',
  `text_content` text COLLATE utf8mb4_unicode_ci COMMENT '期刊详细前言序言/序诗',
  `wechat_link` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '微信公众号关联版块外链',
  `tags` json DEFAULT NULL COMMENT '期刊核心标签关键字数组',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='遇见世界独立美学电子期刊杂志表';

-- ----------------------------
-- Records of column_issues
-- ----------------------------
INSERT INTO `column_issues` (`id`, `title`, `issue_no`, `issue_title`, `subtitle`, `date`, `main_image`, `summary`, `text_content`, `wechat_link`, `tags`) VALUES ('issue-1', '遇见世界', '第一期', '朔', '万物始于幽暗，又归于初晖', '2025.04', 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=1200&q=80', '朔，月之初也。在没有光亮的那一晚，一切生命的喧嚣退回到更深邃的沉默中。此时的沉默不是消逝，是对下一次皎洁的积蓄。《遇见世界》首期，探讨东方山水里的‘留白’与自然运行最安静的那一个片刻。', '朔是不可见的旅程，新月初萌，幽暗如墨。

在浩瀚的宇宙里，‘朔’代表着一个旧循环的隐退，和新循环最谦卑的起头。我们习惯于追求中秋的满月与圆融，却往往忽略了没有月光时的寂静之美。东方山水画里的‘留白’便是这一哲学的视觉延伸。墨色最浅处，恰是想象最丰盈的地方。当你觉得身处人生的黑夜、不知明天的方向时，或许你正站立在‘朔’的节点上。静止下来，听心跳的声音，听积雪融化的声音，静待那抹注定要降临的微茫。', 'https://mp.weixin.qq.com/s/placeholder-shuo', '["自然静思", "东方美学", "朔月"]');
INSERT INTO `column_issues` (`id`, `title`, `issue_no`, `issue_title`, `subtitle`, `date`, `main_image`, `summary`, `text_content`, `wechat_link`, `tags`) VALUES ('issue-2', '遇见世界', '第二期', '青', '雨过天晴，万物浸润，幽微里的那一抹生息', '2025.05', 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80', '青，东方木之色也，代表生命在幽微之中挣扎出来的第一抹亮色。它是草木新发，也是远山含黛，是江南雨后的一袭清凉，本期结合法国南部与中国江南的青绿色彩进行跨时空的对话。', '青，是生命蓬勃前的自审与自持。

它不是艳俗明朗的绿，而是掺和了黛、白、甚至一抹冷灰的东方青色。在宋瓷中，‘雨过天青云破处’是无法复刻的巅峰；在法国南部的山间，普罗旺斯的碧色橡木林在薄雾里展现着异曲同工的朦胧质感。青色，代表着一种既生机勃勃又极其内敛的状态。在本期《遇见世界·青》中，我们行走在一座座古老的松林和被雨水洗刷过的石阶上，试图用镜头和文字记录并解构这抹最不可捉摸的‘天青色’，那是属于风暴过后的、永恒的和解与平静。', 'https://mp.weixin.qq.com/s/placeholder-qing', '["法国南部", "大宋天青", "江南行走"]');


-- ----------------------------
-- Table structure for column_articles
-- ----------------------------
DROP TABLE IF EXISTS `column_articles`;
CREATE TABLE `column_articles` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章唯一标识ID',
  `issue_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '所属期刊ID外键',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章主标题',
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '文章副标题',
  `date` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '文章撰写发布日期',
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章多段落/富文本详细内容',
  `sort_order` int(11) DEFAULT '0' COMMENT '文章在期刊内的展示排序权重',
  PRIMARY KEY (`id`),
  KEY `issue_id` (`issue_id`),
  CONSTRAINT `column_articles_ibfk_1` FOREIGN KEY (`issue_id`) REFERENCES `column_issues` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='期刊下级联发布的具体文章正文表';

-- ----------------------------
-- Records of column_articles
-- ----------------------------
INSERT INTO `column_articles` (`id`, `issue_id`, `title`, `subtitle`, `date`, `content`, `sort_order`) VALUES ('art-1-1', 'issue-1', '朔月之始：万物退回幽暗里的深呼吸', '生命周期的隐退与初萌', '2025.04.01', '在浩瀚的宇宙里，“朔”代表着一个旧循环的隐退，和新循环最谦卑的起头。我们习惯于追求中秋的满月与圆融，却往往忽略了没有月光时的寂静之美。

当夜空最深沉、月亮完全隐匿的时候，大地的万物实际上在经历一场深呼吸。植物在黑暗里安睡，昆虫的声音也降到了最低限。这种幽暗并非虚无，而是一切生机重返胚胎状态、积蓄力量的温床。唯有懂得在长夜中静处，才能在第一屡新芽吐露时，听懂大地无声的欢歌。', 0);
INSERT INTO `column_articles` (`id`, `issue_id`, `title`, `subtitle`, `date`, `content`, `sort_order`) VALUES ('art-1-10', 'issue-1', '重返自由：在声音与黑白交错的尽头安息', '相遇、共鸣与片刻的沉浸', '2025.04.30', '生命的终点，究竟会以怎样的形式呈现？在这首期《遇见世界·朔》的末尾，我们不禁想探讨这个宏大而虚无的论题。

当所有的画面退色为极致的黑和白，当外界所有纷繁的声音都沉入那股最原始的静默深渊，我们没有感到恐惧，反而收获了前所未有的安详与重返自由的喜悦。在这个被繁琐现实撕扯得支离破碎的世界里，能够在我的这块文字与影像切片里做片刻停留的归客们，愿我们在这极致的寂静中，相遇、相知、相通，然后，轻松地拍拍身上的微尘，重返心灵的绝对自由。', 0);
INSERT INTO `column_articles` (`id`, `issue_id`, `title`, `subtitle`, `date`, `content`, `sort_order`) VALUES ('art-1-2', 'issue-1', '水墨留白：宋画里的虚实与无声之雷', '东方山水美学的最高境界', '2025.04.04', '东方山水画里的“留白”，是“朔”之哲学在视觉上的延伸。在马远或夏圭的残山剩水里，不著一墨的宣纸，往往成了云海、大川甚至是天地间无穷无尽的万象。

墨色最浅最空处，恰恰是观者想象最丰盈的地方。虚实相生，无声胜有声。那纸面上的“空”，就像是寂静之中的一声惊雷，震荡着观者的心灵。当代生活塞得太满、太吵闹，而退回到一幅画的留白处，就像是在心灵深处为自己腾出了一个不被侵扰的角落。', 0);
INSERT INTO `column_articles` (`id`, `issue_id`, `title`, `subtitle`, `date`, `content`, `sort_order`) VALUES ('art-1-3', 'issue-1', '在京都的苔藓里，寻找侘寂的温度', '不完美中隐藏的世界本真', '2025.04.08', '行走在西芳寺或大德寺的高低有致的庭院里，我常被那一层层厚厚的、深浅不一的绿苔击中。它们生长在潮湿的黑石缝中、古木的残躯里，默默无闻，甚至有些粗粝。

这就是“侘寂（Wabi-Sabi）”——一种去芜存菁、坦然接受生命残缺与消逝的极致美学。京都的苔藓折射着不被雕琢的温度，它告诉我们，万物无需完美，其在风霜雨露中留下的痕迹，恰恰是其最真实、最值得被热爱的证据。在苔藓的静默中，时间放慢了脚步。', 0);
INSERT INTO `column_articles` (`id`, `issue_id`, `title`, `subtitle`, `date`, `content`, `sort_order`) VALUES ('art-1-4', 'issue-1', '一盏烛火的重量：蜡泪、棉芯与夜晚的静止', '手作器物中的静心自省', '2025.04.11', '每当我点燃自己调配的大豆蜡烛，静静看它在粗陶小盒里融化，那一小圈淡黄色的光晕，便在房间里雕刻出一个神圣的空间。

蜡泪顺着杯壁缓缓滑落，棉芯发出微弱的噼啪声。那一刻，黑夜似乎静止了。气味是通往记忆的钥匙，檀香的悠远混杂着松雪的清冷，在这个瞬间，白日的焦躁与不安都被这团温暖的微光融化。这一只小小的蜡烛，它的重量不在于物质，而在于它能把我们带回当下，带回对自我的凝视。', 0);
INSERT INTO `column_articles` (`id`, `issue_id`, `title`, `subtitle`, `date`, `content`, `sort_order`) VALUES ('art-1-5', 'issue-1', '莱姆石与重黑泥：当代空间的冷硬与柔密', '探讨器物艺术在荒野与居所', '2025.04.14', '在一次当代器物群展上，莱姆石的白与重黑泥的黑形成了极其强烈的张力。白石由于质地轻盈、折射细腻，显示出某种天空的缥缈；而黑泥沉重粗粝，完全吸收了周围的杂音，透露出大地的寂静。

当代生活常以冰冷的钢筋水泥构筑空间，而这些粗陶器皿的存在，就像是用手 and 温度对冷硬环境进行的一次次温和而坚韧的反抗。它们用天然的纹路和不规则的弧度，让僵硬的人工逻辑有了喘息的缝隙，使居所重归自然规律。', 0);
INSERT INTO `column_articles` (`id`, `issue_id`, `title`, `subtitle`, `date`, `content`, `sort_order`) VALUES ('art-1-6', 'issue-1', '镜头之外：为何我们在日常中按动快门', '摄影作为世界切片的真理', '2025.04.17', '对我而言，摄影从来不是对现实的机械复制，而是对某个瞬间的“深切回应”。当我们从取景器中看世界，四周的喧嚣退去，只有光影在交织起舞。

按下快门的那一秒，是对世界赐予灵感的一声叹息与致敬。它是一张切片、一个坐标。哪怕光线很微弱，在它被镜头定格的时刻，那一抹微茫也拥有了对抗永恒虚无的力量。照片中留下的，不仅是山海与归客，更是拍摄者在那个特定时刻，对何为人生的无声叩问。', 0);
INSERT INTO `column_articles` (`id`, `issue_id`, `title`, `subtitle`, `date`, `content`, `sort_order`) VALUES ('art-1-7', 'issue-1', '不言其美的山海：那些被我们遗弃的微茫瞬间', '行者在温州与川西的手记', '2025.04.20', '在楠溪江冰冷的清流里，或在川西八郎生都刺骨的寒风中，我都感到一种由于天地过于宏大而产生的庄严寂静。山海万物不曾多言其美，它们只是日复一日、年复一年地依照古老的秩序运转。

那些被我们行色匆匆的旅人遗忘的角落——一块苔藓密布的雨后石阶、一缕重云背后漏出的微弱天光，才包藏着大自然最丰满的情感。只有当你彻底放低身段、保持谦卑，山海才会向你敞开怀抱，让你在它永恒的寂寥中，找到灵魂的安宿之处。', 0);
INSERT INTO `column_articles` (`id`, `issue_id`, `title`, `subtitle`, `date`, `content`, `sort_order`) VALUES ('art-1-8', 'issue-1', '深夜阅读：清风朗月下的思想与共鸣', '在泛黄的书页中与古人重逢', '2025.04.23', '每逢清风朗月的夜晚，我喜欢合上电子设备，点亮香炉与微弱的灯火，抽出一卷发黄的书册。在纸墨香气中，时空的界限变得模糊。

那些几百年前在黑暗中低吟、在孤独里落笔的作者，他们的字句在这微弱光线的投影下跃入我的脑海。那种相遇与共鸣，超越了生死、阶级与国家的藩篱。那一刻，你并不孤单，因为曾有无数寂寞而高贵的灵魂在同样的夜空下，为你点燃过一盏思想之灯。阅读，成为了尘世中最温柔的重逢。', 0);
INSERT INTO `column_articles` (`id`, `issue_id`, `title`, `subtitle`, `date`, `content`, `sort_order`) VALUES ('art-1-9', 'issue-1', '手作的温度：指尖抚摸陶土时的粗粝自审', '拉坯转盘上的冥想之旅', '2025.04.26', '当双手沾满湿润的太湖粘土，耳边只有拉坯机轮盘匀速转动的沙沙声，你就会惊奇地发现，所有的念头都消失了。陶泥是十分敏感的，你呼吸有一丝急促、手指有一力过猛，它在瞬间就会塌陷、走形。

拉坯是一场双手与泥土最诚实的搏斗，也是最深沉的心理自审。粗粝的沙粒在指尖打磨，逼着你放下所有虚伪的技巧和骄傲，老老实实去顺应泥土的个性和重力的规律。每一个最终烧制而成的陶器，其微小的瑕疵其实都是制作者在那个转瞬即逝的瞬间，最真实的生命刻度。', 0);
INSERT INTO `column_articles` (`id`, `issue_id`, `title`, `subtitle`, `date`, `content`, `sort_order`) VALUES ('art-2-1', 'issue-2', '天青云破：雨后宋瓷里的神秘极简', '寻迹汝瓷永恒的纯净世界', '2025.05.02', '大宋徽宗的那句“雨过天青云破处，这般颜色做将来”，让一种略带感伤也极具神秘的青色，成为了东方美学的永恒图腾。那不是草率的翠，而是带着冷灰、白玉和极度内敛的雨后青空之色。', 0);
INSERT INTO `column_articles` (`id`, `issue_id`, `title`, `subtitle`, `date`, `content`, `sort_order`) VALUES ('art-2-2', 'issue-2', '普罗旺斯的碧青橡木：南法山野的草本朦胧', '跨越欧亚大陆的生态色彩共鸣', '2025.05.15', '在法国普罗旺斯起伏的峡谷中，大片低矮的碧青色橡木林铺陈在阿尔卑斯余脉湿润的早雾里。这些耐干旱的针叶与灌木，在烈日下散发出浓烈的柏木油脂与干燥百里香的独特气味，呈现出一种超越了地理与生命的共鸣，那是地道而粗犷的自愈色彩。', 0);


SET FOREIGN_KEY_CHECKS = 1;
