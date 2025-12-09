#!/bin/bash

# Seed About Sections via Strapi API
API_URL="http://localhost:1337/api"
TOKEN="44d7d02e56c1f0c5915de077a4a553864b5bbab3318078a46527ce41f7fb6f92c2b369745e26e4deb570a9c25df01e6372437c3ea6ce5ebb537169f5760b9a84fa2615317f73ee58dbbf2c72ea1c14bdfe426e798813c3954ddcc8fedeabe184625cdc1cc20a481f9cf8ad4b3f2f5a613d201bfacdfb78178f6e51a88b91890f"

echo "Seeding About Sections..."

# Brand Story
echo "Creating Brand Story section..."
curl -X POST "${API_URL}/about-sections" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Brand Story",
      "slug": "brand-story",
      "order": 1,
      "content": "# Our Brand Story\n\nThe Bureau of Wonders was born from a simple yet powerful belief: that luxury brands deserve communications partners who truly understand the art of storytelling and the science of building desire.\n\nFounded in the heart of New York, our journey began when a group of seasoned luxury brand professionals came together with a shared vision. We had worked with some of the world'\''s most prestigious brands and witnessed firsthand the transformative power of authentic, strategic communications.\n\n## The Beginning\n\nOur founders brought together decades of experience from luxury houses, leading PR agencies, and high-end event production companies. What united us was a passion for excellence and a deep appreciation for the craftsmanship, heritage, and artistry that define luxury brands.\n\n## Our Evolution\n\nOver the years, we'\''ve grown from a boutique consultancy to a full-service luxury communications agency. Yet, we'\''ve never lost sight of what makes us special: our intimate understanding of luxury, our commitment to personalized service, and our ability to create moments of wonder that captivate audiences.\n\n## Today\n\nToday, The Bureau of Wonders stands as a trusted partner to luxury brands across multiple sectors. We'\''ve orchestrated unforgettable product launches, crafted compelling brand narratives, and built lasting relationships between brands and their most valued customers.\n\nEvery project we undertake is infused with the same dedication to excellence that our clients bring to their own creations. Because we believe that in the world of luxury, nothing less than extraordinary will do.",
      "seoTitle": "Our Brand Story - The Bureau of Wonders",
      "metaDescription": "Discover the story behind The Bureau of Wonders, from our founding vision to becoming a trusted luxury brand communications partner.",
      "publishedAt": "2025-12-09T14:00:00.000Z"
    }
  }'

# Brand Philosophy
echo -e "\n\nCreating Brand Philosophy section..."
curl -X POST "${API_URL}/about-sections" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Brand Philosophy",
      "slug": "brand-philosophy",
      "order": 2,
      "content": "# Our Brand Philosophy\n\n## The Art of Wonder\n\nAt The Bureau of Wonders, we believe that luxury is not just about products—it'\''s about creating moments of wonder, surprise, and delight. Every touchpoint, every communication, every experience should evoke emotion and build desire.\n\n## Authenticity Above All\n\nIn an age of digital noise and fleeting trends, we champion authenticity. We help luxury brands tell their true stories—stories rooted in heritage, craftsmanship, and genuine value. Because today'\''s discerning consumers can sense authenticity, and they reward it with their loyalty.\n\n## The Power of Relationships\n\nLuxury is personal. It'\''s about relationships built on trust, understanding, and shared values. We don'\''t just create campaigns; we build bridges between brands and the people who will cherish them for a lifetime.\n\n## Excellence in Every Detail\n\nJust as luxury brands obsess over every stitch, every finish, every detail, we bring the same meticulous attention to our work. From the first strategic conversation to the final execution, excellence is our standard.\n\n## Innovation Meets Tradition\n\nWe honor the traditions and heritage that make luxury brands special, while embracing innovation in how we communicate their stories. We blend time-tested PR principles with cutting-edge digital strategies to create campaigns that resonate across generations.\n\n## Sustainability and Responsibility\n\nWe believe that true luxury is sustainable luxury. We encourage and support our clients in communicating their commitments to environmental and social responsibility, because the future of luxury depends on it.\n\n## Creating Legacy\n\nEvery brand we work with is building a legacy. Our role is to ensure that legacy is communicated with clarity, celebrated with creativity, and preserved with care. We'\''re not just in the business of marketing—we'\''re in the business of building enduring brand value.",
      "seoTitle": "Our Brand Philosophy - The Bureau of Wonders",
      "metaDescription": "Explore the core philosophy that guides our approach to luxury brand communications: authenticity, excellence, and the art of creating wonder.",
      "publishedAt": "2025-12-09T14:00:00.000Z"
    }
  }'

# Who We Are
echo -e "\n\nCreating Who We Are section..."
curl -X POST "${API_URL}/about-sections" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Who We Are",
      "slug": "who-we-are",
      "order": 3,
      "content": "# Who We Are\n\n## A Team of Luxury Specialists\n\nThe Bureau of Wonders is home to a diverse team of communications professionals, each bringing unique expertise and a shared passion for luxury brands.\n\n## Our Expertise\n\n### Strategic Communications\nOur strategists have worked with luxury brands across multiple sectors, from haute horlogerie to high jewelry, from luxury real estate to premium hospitality. They understand the nuances of luxury marketing and the expectations of high-net-worth individuals.\n\n### Creative Excellence\nOur creative team includes award-winning copywriters, art directors, and content creators who know how to craft messages that resonate with sophisticated audiences. They'\''ve created campaigns for some of the world'\''s most prestigious brands.\n\n### Media Relations\nOur PR professionals have deep relationships with top-tier media outlets, luxury lifestyle publications, and influential journalists. They know how to secure the coverage that matters most to luxury brands.\n\n### Event Production\nOur event specialists have orchestrated everything from intimate VIP dinners to large-scale brand activations. They understand that in luxury, every detail matters.\n\n### Digital Innovation\nOur digital team stays ahead of trends in social media, influencer marketing, and digital storytelling. They know how to leverage technology while maintaining the exclusivity and prestige that luxury brands require.\n\n## Our Culture\n\nWe foster a culture of collaboration, creativity, and continuous learning. Our team members are encouraged to bring fresh ideas, challenge conventions, and push boundaries—all while maintaining the highest standards of professionalism and client service.\n\n## Our Commitment\n\nWe'\''re committed to being more than just an agency—we'\''re partners in our clients'\'' success. We invest time in understanding each brand'\''s unique story, challenges, and aspirations. And we bring that understanding to every project we undertake.",
      "seoTitle": "Who We Are - Meet The Bureau of Wonders Team",
      "metaDescription": "Meet the team behind The Bureau of Wonders: luxury communications specialists, creative experts, and strategic thinkers dedicated to your brand'\''s success.",
      "publishedAt": "2025-12-09T14:00:00.000Z"
    }
  }'

# Leadership Introduction
echo -e "\n\nCreating Leadership Introduction section..."
curl -X POST "${API_URL}/about-sections" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Leadership Introduction",
      "slug": "leadership-introduction",
      "order": 4,
      "content": "# Our Leadership\n\n## Guiding The Bureau of Wonders\n\nOur leadership team brings together decades of experience in luxury brand management, communications, and strategic consulting. They'\''ve worked with iconic brands, launched groundbreaking campaigns, and built lasting relationships in the luxury industry.\n\n## Sophia Chen - Founder & CEO\n\n**\"Luxury is about creating desire through authenticity and artistry.\"**\n\nWith over 20 years of experience in luxury brand communications, Sophia founded The Bureau of Wonders with a vision to create an agency that truly understands the luxury mindset. Prior to founding the agency, she led communications for several prestigious jewelry and watch brands, and served as VP of Marketing for a leading luxury hospitality group.\n\nSophia holds an MBA from Columbia Business School and a degree in Art History from Yale University. She'\''s a frequent speaker at luxury industry conferences and has been featured in publications including Vogue Business, Luxury Daily, and The Business of Fashion.\n\n## Marcus Beaumont - Chief Strategy Officer\n\n**\"Strategy without creativity is just planning. Creativity without strategy is just art. We bring both.\"**\n\nMarcus brings 18 years of strategic consulting experience to The Bureau of Wonders. He'\''s developed brand strategies for luxury fashion houses, high-end real estate developers, and premium automotive brands. His analytical approach combined with creative thinking has helped numerous brands navigate market challenges and seize new opportunities.\n\nBefore joining The Bureau of Wonders, Marcus was a Partner at a leading brand strategy consultancy. He holds degrees from Oxford University and INSEAD.\n\n## Isabella Rodriguez - Creative Director\n\n**\"Every brand has a story worth telling. Our job is to tell it beautifully.\"**\n\nIsabella'\''s creative vision has shaped campaigns for some of the world'\''s most recognizable luxury brands. With a background in fashion journalism and brand creative direction, she brings a unique perspective that blends editorial sophistication with commercial effectiveness.\n\nHer work has won numerous industry awards, including Cannes Lions and Clio Awards. Isabella previously served as Creative Director for a prestigious fashion house and as Features Editor for a leading luxury lifestyle magazine.\n\n## James Wellington - Managing Director, Client Services\n\n**\"Our clients'\'' success is our success. It'\''s that simple.\"**\n\nJames ensures that every client receives exceptional service and strategic guidance. With 15 years of experience in luxury brand management and client relations, he'\''s known for his ability to build strong partnerships and deliver results that exceed expectations.\n\nPrior to joining The Bureau of Wonders, James held senior positions at leading luxury PR agencies and worked directly for several high-end brands. He'\''s a graduate of the London School of Economics.",
      "seoTitle": "Leadership Team - The Bureau of Wonders",
      "metaDescription": "Meet the leadership team at The Bureau of Wonders: experienced luxury brand professionals guiding our strategic vision and creative excellence.",
      "publishedAt": "2025-12-09T14:00:00.000Z"
    }
  }'

# Our Values
echo -e "\n\nCreating Our Values section..."
curl -X POST "${API_URL}/about-sections" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Our Values",
      "slug": "our-values",
      "order": 5,
      "content": "# Our Values\n\nThese core values guide everything we do at The Bureau of Wonders. They shape how we work with clients, how we collaborate as a team, and how we approach every project.\n\n## Excellence\n\n**We strive for perfection in everything we do.**\n\nExcellence isn'\''t just a goal—it'\''s our standard. From strategic planning to creative execution, from client communications to event production, we bring meticulous attention to detail and an unwavering commitment to quality. We believe that luxury brands deserve nothing less than exceptional service and outstanding results.\n\n## Innovation\n\n**We push boundaries and embrace new ideas.**\n\nThe luxury industry is evolving, and we evolve with it. We stay ahead of trends, experiment with new technologies, and constantly seek fresh approaches to communications challenges. But we never innovate for innovation'\''s sake—every new idea must serve our clients'\'' strategic objectives and enhance their brand value.\n\n## Integrity\n\n**We build trust through transparency and honesty.**\n\nIn an industry built on relationships, integrity is everything. We'\''re honest with our clients about what'\''s possible, transparent about our processes, and accountable for our results. We protect our clients'\'' confidentiality, respect their trust, and always act in their best interests.\n\n## Collaboration\n\n**We work as partners with our clients.**\n\nWe don'\''t believe in the traditional agency-client hierarchy. Instead, we see ourselves as partners in our clients'\'' success. We listen carefully, share ideas openly, and work together to achieve shared goals. The best results come from true collaboration, where diverse perspectives and expertise come together.\n\n## Creativity\n\n**We bring imagination to every project.**\n\nCreativity is at the heart of what we do. Whether we'\''re crafting a press release, planning an event, or developing a social media strategy, we approach every challenge with fresh eyes and imaginative thinking. We believe that creative solutions are often the most effective solutions—especially in the world of luxury, where standing out matters.\n\n## Respect\n\n**We honor the heritage and craftsmanship of luxury brands.**\n\nWe have deep respect for the artisans, designers, and visionaries who create luxury products. We understand that behind every luxury brand is a story of dedication, skill, and passion. Our role is to honor that story and communicate it in ways that resonate with audiences who appreciate true quality.\n\n## Sustainability\n\n**We support responsible luxury.**\n\nWe believe that the future of luxury is sustainable luxury. We encourage our clients to embrace environmental and social responsibility, and we help them communicate their commitments authentically. Because true luxury should enhance the world, not diminish it.",
      "seoTitle": "Our Values - The Bureau of Wonders",
      "metaDescription": "Discover the core values that guide The Bureau of Wonders: excellence, innovation, integrity, collaboration, creativity, respect, and sustainability.",
      "publishedAt": "2025-12-09T14:00:00.000Z"
    }
  }'

echo -e "\n\n✓ About Sections seeding completed!"
