const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = require('../models/Post');
const now = new Date();

const PUBLISHED_QUERY = { status: 'PUBLISHED' };
const SORT_NEWEST = { publishedAt: -1, createdAt: -1 };
const LIST_PROJECTION = [
  'title',
  'slug',
  'excerpt',
  'coverUrl',
  'tags',
  'publishedAt',
  'createdAt',
  'updatedAt'
].join(' ');
const DETAIL_PROJECTION = `${LIST_PROJECTION} contentHtml authorId editor`;

const toLeanWithFallbackDates = (docs) =>
  docs.map((doc) => ({
    ...doc,
    publishedAt: doc.publishedAt || doc.createdAt,
  }));

const escapeRegex = (input = '') => input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * GET /
 * HOME
*/
router.get('/api/articles/latest', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;
    const posts = await Post.find(PUBLISHED_QUERY)
      .sort(SORT_NEWEST)
      .limit(limit)
      .select(LIST_PROJECTION)
      .lean();

    res.json(toLeanWithFallbackDates(posts));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch latest articles' });
  }
});


router.get('', async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    const perPage = parseInt(req.query.perPage, 10) || 6;
    const page = parseInt(req.query.page, 10) || 1;
    const skip = (page - 1) * perPage;

    const [posts, total] = await Promise.all([
      Post.find(PUBLISHED_QUERY)
        .sort(SORT_NEWEST)
        .skip(skip)
        .limit(perPage)
        .select(LIST_PROJECTION)
        .lean(),
      Post.countDocuments(PUBLISHED_QUERY),
    ]);

    const nextPage = page + 1;
    const hasNextPage = nextPage <= Math.ceil(total / perPage);

    res.render('index', {
      locals,
      data: toLeanWithFallbackDates(posts),
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/',
    });

  } catch (error) {
    console.log(error);
  }

});

/**
 * GET /api/articles
 */
router.get('/api/articles', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 12, 50);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Post.find(PUBLISHED_QUERY)
        .sort(SORT_NEWEST)
        .skip(skip)
        .limit(limit)
        .select(LIST_PROJECTION)
        .lean(),
      Post.countDocuments(PUBLISHED_QUERY),
    ]);

    res.json({
      items: toLeanWithFallbackDates(items),
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + items.length < total,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch articles' });
  }
});

// router.get('', async (req, res) => {
//   const locals = {
//     title: "NodeJs Blog",
//     description: "Simple Blog created with NodeJs, Express & MongoDb."
//   }

//   try {
//     const data = await Post.find();
//     res.render('index', { locals, data });
//   } catch (error) {
//     console.log(error);
//   }

// });


/**
 * GET /
 * Post :id
*/
router.get('/post/:id', async (req, res) => {
  try {
    const identifier = req.params.id;
    const filter = { ...PUBLISHED_QUERY };

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      filter._id = identifier;
    } else {
      filter.slug = identifier;
    }

    const data = await Post.findOne(filter).select(DETAIL_PROJECTION).lean();

    if (!data) {
      return res.status(404).render('post', {
        locals: { title: 'Post not found', description: '' },
        data: null,
        currentRoute: `/post/${identifier}`,
      });
    }

    const locals = {
      title: data.title,
      description: data.excerpt || 'Simple Blog created with NodeJs, Express & MongoDb.',
    };

    const viewData = {
      ...data,
      body: data.contentHtml,
    };

    res.render('post', {
      locals,
      data: viewData,
      currentRoute: `/post/${data.slug || identifier}`,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }

});

router.get('/api/post/:id', async (req, res) => {
  try {
    const identifier = req.params.id;
    const filter = { ...PUBLISHED_QUERY };

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      filter._id = identifier;
    } else {
      filter.slug = identifier;
    }

    const data = await Post.findOne(filter).select(DETAIL_PROJECTION).lean();

    if (!data) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({
      ...data,
      publishedAt: data.publishedAt || data.createdAt,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
});

/**
 * POST /
 * Post - searchTerm
*/
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: 'Search',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.',
    };

    const searchTerm = (req.body.searchTerm || '').trim();
    const escapedTerm = escapeRegex(searchTerm);

    if (!escapedTerm) {
      return res.render('search', {
        data: [],
        locals,
        currentRoute: '/',
      });
    }

    const regex = new RegExp(escapedTerm, 'i');
    const data = await Post.find({
      ...PUBLISHED_QUERY,
      $or: [
        { title: { $regex: regex } },
        { excerpt: { $regex: regex } },
        { contentHtml: { $regex: regex } },
      ],
    })
      .select(LIST_PROJECTION)
      .lean();

    res.render('search', {
      data: toLeanWithFallbackDates(data),
      locals,
      currentRoute: '/',
    });

  } catch (error) {
    console.log(error);
  }

});

router.post('/api/search', async (req, res) => {
  try {
    const { searchTerm = '' } = req.body || {};
    const escapedTerm = escapeRegex(searchTerm.trim());
    if (!escapedTerm) {
      return res.json([]);
    }
    const regex = new RegExp(escapedTerm, 'i');
    const data = await Post.find({
      ...PUBLISHED_QUERY,
      $or: [
        { title: { $regex: regex } },
        { excerpt: { $regex: regex } },
        { contentHtml: { $regex: regex } },
      ],
    })
      .select(LIST_PROJECTION)
      .lean();
    res.json(toLeanWithFallbackDates(data));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to search articles' });
  }
});

// fetch
router.post('/api/articles/by-tag', async (req, res) => {
  try {
    const { tag = '' } = req.body || {};
    const cleanedTag = tag.trim();
    if (!cleanedTag) {
      return res.json([]);
    }
    const posts = await Post.find({
      ...PUBLISHED_QUERY,
      tags: cleanedTag,
    })
      .sort(SORT_NEWEST)
      .select(LIST_PROJECTION)
      .lean();
    res.json(toLeanWithFallbackDates(posts));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch tagged articles' });
  }
});

/**
 * GET /
 * About
*/
router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});


// const draftPosts = [
//   {
//     title: '東北大学、次世代材料研究で新成果を発表',
//     slug: 'tohoku-next-gen-materials',
//     contentHtml: `<p>東北大学の研究チームは、新素材の開発で大きな進展を発表しました。今回の成果は…</p>
// <p>研究代表者は「産学連携による実用化を目指す」とコメントしています。</p>`,
//     excerpt: '東北大学が次世代材料の研究で得た成果を詳しく紹介します。',
//     coverUrl: 'https://example.com/images/materials.jpg',
//     tags: ['研究', '科学', '大学'],
//     status: 'PUBLISHED',
//     editor: 'html',
//     publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2),
//   },
//   {
//     title: '仙台市内イベントまとめ 2024年11月',
//     slug: 'sendai-event-roundup-2024-11',
//     contentHtml: `<p>仙台市で開催される注目イベントをまとめました。文化祭から音楽ライブまで…</p>
// <ul><li>光のページェント</li><li>杜の都ジャズフェスティバル</li><li>地域マルシェ</li></ul>`,
//     excerpt: '2024年11月に仙台で開催される注目イベントの概要です。',
//     coverUrl: 'https://example.com/images/sendai-events.jpg',
//     tags: ['イベント', '仙台', '文化'],
//     status: 'PUBLISHED',
//     editor: 'html',
//     publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5),
//   },
//   {
//     title: '東北大生と考えるキャリアの現在地',
//     slug: 'career-insights-tohoku-students',
//     contentHtml: `<p>東北大学の学生にキャリア観を聞きました。変化が激しい時代に、どのような準備をしているのか…</p>
// <p>インタビューでは、研究と就職活動の両立に向けた工夫も紹介しています。</p>`,
//     excerpt: '東北大学生のキャリア観をインタビュー形式でお届けします。',
//     coverUrl: 'https://example.com/images/career-talk.jpg',
//     tags: ['学生', 'キャリア', 'インタビュー'],
//     status: 'PUBLISHED',
//     editor: 'html',
//     publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10),
//   },
// ];

// try {
//   Post.insertMany(draftPosts, { ordered: false });
//   console.log('Placeholder posts inserted');
// } catch (error) {
//   if (error.code === 11000) {
//     console.warn('Some placeholders already exist (duplicate slug). Skipping duplicates.');
//   } else {
//     console.error('Failed to insert placeholder posts', error);
//   }
// }


module.exports = router;
