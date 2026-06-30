import React from 'react';
import { motion } from 'motion/react';
import mistyMoon from '../assets/images/misty_ink_moon_1780370719058.png';

export const SolarDietPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full min-h-[520px] overflow-hidden flex items-center justify-center"
      >
        <img 
          src={mistyMoon} 
          alt="AI节气饮食 - 传统中医与现代AI的融合"
          className="absolute top-0 left-0 w-full h-full object-cover filter brightness-[0.55] saturate-[0.9]"
        />
        <div className="relative z-10 text-center px-4 py-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block bg-[rgba(91,140,90,0.85)] text-white text-sm font-bold tracking-[0.15em] uppercase px-4 py-1.5 rounded-full mb-6"
          >
            TRAE AI 创造力大赛
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-serif text-3xl md:text-5xl text-white leading-[1.3] mb-4 text-shadow-lg"
          >
            AI节气饮食<br/>开启健康养生之路
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl text-white/90 font-light tracking-wider"
          >
            生活娱乐赛道 · 以节气智慧为根，以AI技术为翼
          </motion.p>
        </div>
      </motion.section>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* Section 1: 创意名称与介绍 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-9 h-9 flex items-center justify-center bg-[#5B8C5A] text-white font-bold rounded-full text-sm">1</span>
            <h2 className="font-serif text-xl md:text-2xl text-[#2C2416]">创意名称与创意介绍</h2>
          </div>

          <div className="bg-gradient-to-r from-[rgba(91,140,90,0.08)] to-[rgba(196,149,106,0.08)] border-l-4 border-[#5B8C5A] rounded-r-lg p-5 my-6 font-serif italic text-lg text-[#2C2416] leading-relaxed">
            "顺时而食，以养身心" —— 让千年中医节气智慧走进每个人的日常餐桌。
          </div>

          <h3 className="text-lg text-[#5B8C5A] font-semibold mt-6 mb-3 pl-3 border-l-3 border-[#C4956A]">
            创意名称：节气膳灵（Solar Diet AI）
          </h3>
          <p className="text-[#8A7E6B] text-lg leading-relaxed mb-4">
            节气膳灵是一款融合<strong className="text-[#2C2416]">中医体质辨识、二十四节气养生理论、五行生克原理</strong>与<strong className="text-[#2C2416]">AI智能推荐算法</strong>的个性化饮食养生应用。它如同一位随身携带的"药膳宫"御医，根据用户当下的身体状况、所处节气与五行属性，精准推荐最适合的食材、食谱与养生方案。
          </p>

          <h3 className="text-lg text-[#5B8C5A] font-semibold mt-6 mb-3 pl-3 border-l-3 border-[#C4956A]">
            想解决什么问题
          </h3>
          <p className="text-[#2C2416] leading-relaxed mb-4">
            现代人普遍面临"知道养生重要，却不知道怎么养"的困境。网上养生信息碎片化、同质化严重，缺乏针对个人体质和时令变化的精准指导。节气膳灵正是为了<strong>让专业中医养生知识变得人人可用、时时可用</strong>而生。
          </p>

          <h3 className="text-lg text-[#5B8C5A] font-semibold mt-6 mb-3 pl-3 border-l-3 border-[#C4956A]">
            产品形态
          </h3>
          <p className="text-[#2C2416] leading-relaxed mb-4">
            节气膳灵初期以<strong>微信小程序 + 移动端App</strong>为主要产品形态，同时提供<strong>Web端</strong>供深度用户使用。
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {['微信小程序', '移动端App', 'Web端', '智能硬件联动'].map((tag) => (
              <span 
                key={tag}
                className="bg-[#F5EDE0] text-[#5B8C5A] border border-[#E0D5C3] rounded-full px-3 py-1 text-sm font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="w-16 h-0.5 bg-[#C4956A] mx-auto my-12 rounded" />

        {/* Section 2: 目标用户及痛点 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-9 h-9 flex items-center justify-center bg-[#5B8C5A] text-white font-bold rounded-full text-sm">2</span>
            <h2 className="font-serif text-xl md:text-2xl text-[#2C2416]">目标用户及痛点</h2>
          </div>

          <h3 className="text-lg text-[#5B8C5A] font-semibold mt-6 mb-4 pl-3 border-l-3 border-[#C4956A]">
            面向哪些用户
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: '🎯', title: '职场白领（25-40岁）', desc: '工作压力大、作息不规律、亚健康问题普遍，渴望便捷有效的养生方式' },
              { icon: '👩🍳', title: '关注健康的家庭主妇（30-55岁）', desc: '负责全家饮食，希望为家人提供科学营养的时令膳食' },
              { icon: '📚', title: '养生爱好者', desc: '对中医养生有浓厚兴趣，希望深入了解节气食疗知识' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(44,36,22,0.08)' }}
                className="bg-[#F5EDE0] border border-[#E0D5C3] rounded-xl p-5 transition-all duration-300"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-bold text-[#2C2416] mb-2">{item.title}</div>
                <div className="text-sm text-[#8A7E6B] leading-relaxed">{item.desc}</div>
              </motion.div>
            ))}
          </div>

          <h3 className="text-lg text-[#5B8C5A] font-semibold mt-6 mb-4 pl-3 border-l-3 border-[#C4956A]">
            当前痛点
          </h3>
          <ul className="list-none pl-0">
            {[
              '信息过载却无针对性：搜索"养生食谱"得到成千上万结果，但不知道哪道适合自己',
              '中医门槛高：节气养生涉及阴阳五行、体质辨识等专业知识，普通人难以自行判断',
              '时令意识薄弱：现代生活节奏快，很多人已经失去了"不时不食"的传统饮食智慧',
              '缺乏持续跟踪：即使偶尔尝试养生食谱，也难以坚持，缺少系统性规划'
            ].map((item, idx) => (
              <li key={idx} className="relative pl-6 py-2 text-[#2C2416]">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#C4956A] rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="w-16 h-0.5 bg-[#C4956A] mx-auto my-12 rounded" />

        {/* Section 3: 核心功能 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-9 h-9 flex items-center justify-center bg-[#5B8C5A] text-white font-bold rounded-full text-sm">3</span>
            <h2 className="font-serif text-xl md:text-2xl text-[#2C2416]">核心功能与技术亮点</h2>
          </div>

          <p className="text-[#8A7E6B] text-lg leading-relaxed mb-8">
            节气膳灵的核心在于将传统中医理论与现代AI技术深度融合，打造"懂你、懂时令、懂养生"的智能饮食助手。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: '🧬 AI体质辨识', desc: '通过问卷评估、面部识别和健康数据接入，智能判断用户的中医体质类型，动态追踪体质变化' },
              { title: '🌤️ 节气养生引擎', desc: '内置二十四节气养生知识图谱，涵盖每个节气的气候特点、易发疾病、推荐食材等' },
              { title: '⚖️ 五行饮食平衡', desc: '基于五行与五脏的对应关系，分析用户五行偏性，推荐能够平衡五行的食材组合' },
              { title: '📖 个性化食谱推荐', desc: '综合体质+节气+五行三维数据，AI智能匹配，生成每日三餐推荐方案' },
              { title: '📊 养生数据追踪', desc: '记录用户每日饮食、身体感受和健康指标变化，数据可视化展示养生效果趋势' },
              { title: '🤖 AI养生问答', desc: '内置基于大语言模型的养生知识助手，随时提问获得专业个性化的食疗建议' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(44,36,22,0.08)' }}
                className="bg-[#F5EDE0] border border-[#E0D5C3] rounded-xl p-5 transition-all duration-300"
              >
                <div className="font-bold text-[#2C2416] mb-2">{item.title}</div>
                <div className="text-sm text-[#8A7E6B] leading-relaxed">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="w-16 h-0.5 bg-[#C4956A] mx-auto my-12 rounded" />

        {/* Section 4: 价值与意义 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-9 h-9 flex items-center justify-center bg-[#5B8C5A] text-white font-bold rounded-full text-sm">4</span>
            <h2 className="font-serif text-xl md:text-2xl text-[#2C2416]">价值与意义</h2>
          </div>

          <h3 className="text-lg text-[#5B8C5A] font-semibold mt-6 mb-3 pl-3 border-l-3 border-[#C4956A]">
            商业价值
          </h3>
          <p className="text-[#2C2416] leading-relaxed mb-4">
            中国养生保健市场规模已超过<strong>万亿元</strong>，且持续高速增长。节气膳灵通过"AI+中医文化"的独特定位，切入了一个既有深厚文化底蕴又有巨大市场潜力的蓝海赛道。
          </p>

          <h3 className="text-lg text-[#5B8C5A] font-semibold mt-6 mb-3 pl-3 border-l-3 border-[#C4956A]">
            社会价值
          </h3>
          <ul className="list-none pl-0">
            {[
              '传承中医文化：将二十四节气、五行学说等中华传统医学智慧以数字化方式传承',
              '提升全民健康素养：降低中医养生知识门槛，帮助普通人建立科学饮食观念',
              '助力乡村振兴：通过推荐时令食材，引导消费者关注本地、应季农产品'
            ].map((item, idx) => (
              <li key={idx} className="relative pl-6 py-2 text-[#2C2416]">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#C4956A] rounded-full" />
                {item}
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { num: '24', label: '节气养生智慧模块' },
              { num: '9', label: '种中医体质精准辨识' },
              { num: '5000+', label: '药膳方与食谱数据库' }
            ].map((item, idx) => (
              <div key={idx} className="text-center p-4 bg-white border border-[#E0D5C3] rounded-xl">
                <div className="font-serif text-3xl font-bold text-[#5B8C5A] mb-1">{item.num}</div>
                <div className="text-sm text-[#8A7E6B] font-semibold">{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="w-16 h-0.5 bg-[#C4956A] mx-auto my-12 rounded" />

        {/* Section 5: 技术架构 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-9 h-9 flex items-center justify-center bg-[#5B8C5A] text-white font-bold rounded-full text-sm">5</span>
            <h2 className="font-serif text-xl md:text-2xl text-[#2C2416]">技术架构概览</h2>
          </div>

          <p className="text-[#8A7E6B] text-lg leading-relaxed mb-8">
            节气膳灵采用"AI大模型 + 知识图谱 + 用户画像"的三层技术架构，确保推荐的专业性、个性化和实时性。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: '🤖 AI大模型层', desc: '基于大语言模型构建养生知识引擎，通过RAG技术确保输出的专业性和准确性' },
              { title: '📚 知识图谱层', desc: '构建"节气-食材-体质-五行-功效"多维知识图谱，支撑精准推荐' },
              { title: '👤 用户画像层', desc: '通过多维度数据采集构建动态用户画像，实现"越用越懂你"的个性化体验' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(44,36,22,0.08)' }}
                className="bg-[#F5EDE0] border border-[#E0D5C3] rounded-xl p-5 transition-all duration-300"
              >
                <div className="font-bold text-[#2C2416] mb-2">{item.title}</div>
                <div className="text-sm text-[#8A7E6B] leading-relaxed">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="w-16 h-0.5 bg-[#C4956A] mx-auto my-12 rounded" />

        {/* Section 6: 愿景与展望 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-9 h-9 flex items-center justify-center bg-[#5B8C5A] text-white font-bold rounded-full text-sm">6</span>
            <h2 className="font-serif text-xl md:text-2xl text-[#2C2416]">愿景与展望</h2>
          </div>

          <div className="bg-gradient-to-r from-[rgba(91,140,90,0.08)] to-[rgba(196,149,106,0.08)] border-l-4 border-[#5B8C5A] rounded-r-lg p-5 my-6 font-serif italic text-lg text-[#2C2416] leading-relaxed">
            "让每一个家庭都拥有一位AI药膳师，让节气养生成为生活方式，而非遥不可及的奢侈品。"
          </div>

          <p className="text-[#2C2416] leading-relaxed mb-4">
            节气膳灵的长期愿景是成为<strong>全球领先的AI节气养生平台</strong>。短期内，我们将以中国市场为核心，深耕中医养生场景，打磨产品体验和推荐算法。中期计划拓展至东亚文化圈，长期来看，我们希望将中国节气养生智慧推向全球。
          </p>
        </motion.div>
      </article>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-[#E0D5C3]">
        <p className="text-[#8A7E6B] text-sm">节气膳灵 Solar Diet AI · TRAE AI创造力大赛参赛作品</p>
        <p className="text-[#8A7E6B] text-xs mt-2">以节气智慧为根，以AI技术为翼，开启健康养生之路</p>
      </footer>
    </div>
  );
};
