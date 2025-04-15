import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { SearchArticleDto } from './dto/search-article.dto';
import { ArticleItemReturnDto, ArticleListReturnDto } from './dto/return.dto';
@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 创建新文章
   * @param dto - 创建文章的数据传输对象
   * @param authorId - 作者ID（可选）
   * @returns 返回创建的文章实体
   */
  async createArticle(
    dto: CreateArticleDto,
    walletAddress?: string,
  ): Promise<Article> {
    const article = this.articleRepository.create(dto);
    if (walletAddress) {
      // article.author = { id: authorId } as any;
      // find User by Id
      const author = await this.userRepository.findOne({
        where: { walletAddress },
      });

      if (author) {
        article.author = author;
      }
    }
    return await this.articleRepository.save(article);
  }

  /**
   * 根据ID获取文章详情
   * @param id - 文章ID
   * @returns 返回文章实体，包含作者、点赞和收藏信息
   * @throws NotFoundException - 当文章不存在时抛出异常
   */
  async getArticleById(id: number): Promise<ArticleItemReturnDto> {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['author', 'likedBy', 'favoritedBy'],
    });
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    return article;
  }

  /**
   * 获取所有文章列表
   * @returns 返回文章实体数组，包含作者、点赞和收藏信息
   */
  async getAllArticles(): Promise<Article[]> {
    return await this.articleRepository.find({
      relations: ['author', 'likedBy', 'favoritedBy'],
    });
  }

  /**
   * 根据条件搜索文章
   * @param searchArticleDto - 搜索条件数据传输对象
   * @returns 返回符合条件的文章实体数组
   */
  async searchArticlesByConditions(
    searchArticleDto: SearchArticleDto,
  ): Promise<ArticleListReturnDto> {
    const {
      title,
      status,
      authorId,
      likedUserId,
      favoritedUserId,
      page = 1,
      pageSize = 10,
    } = searchArticleDto;

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.likedBy', 'likedBy')
      .leftJoinAndSelect('article.favoritedBy', 'favoritedBy');

    // 模糊：文章标题
    if (title) {
      queryBuilder.andWhere('article.title LIKE :title', {
        title: `%${title}%`,
      });
    }

    // 文章状态
    if (status) {
      queryBuilder.andWhere('article.status = :status', { status });
    }

    // 作者
    if (authorId) {
      queryBuilder.andWhere('author.id = :authorId', { authorId });
    }

    // 多对多关系：用户点赞文章
    if (likedUserId) {
      queryBuilder
        .andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select('article_likes.article_id')
            .from('article_likes', 'article_likes')
            .where('article_likes.user_id = :likedUserId')
            .getQuery();
          return 'article.id IN ' + subQuery;
        })
        .setParameter('likedUserId', likedUserId);
    }

    // 多对多关系：用户收藏文章
    if (favoritedUserId) {
      queryBuilder
        .andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select('article_favorites.article_id')
            .from('article_favorites', 'article_favorites')
            .where('article_favorites.user_id = :favoritedUserId')
            .getQuery();
          return 'article.id IN ' + subQuery;
        })
        .setParameter('favoritedUserId', favoritedUserId);
    }

    // 计算总数
    const total = await queryBuilder.getCount();

    // 添加分页
    const items = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    return {
      list: items,
      total,
      page,
      pageSize,
    };
  }

  /**
   * 用户点赞文章
   * @param articleId - 文章ID
   * @param userId - 用户ID
   * @returns 返回更新后的文章实体
   * @throws NotFoundException - 当文章不存在时抛出异常
   */
  async likeArticle(articleId: number, userId: number): Promise<Article> {
    const article = await this.getArticleById(articleId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    article.likedBy = [...article.likedBy, user];
    return await this.articleRepository.save(article);
  }

  /**
   * 用户取消点赞文章
   * @param articleId - 文章ID
   * @param userId - 用户ID
   * @returns 返回更新后的文章实体
   * @throws NotFoundException - 当文章不存在时抛出异常
   */
  async unlikeArticle(articleId: number, userId: number): Promise<Article> {
    const article = await this.getArticleById(articleId);
    article.likedBy = article.likedBy.filter((user) => user.id !== userId);
    return await this.articleRepository.save(article);
  }
  /**
   * 用户收藏文章
   * @param articleId - 文章ID
   * @param userId - 用户ID
   * @returns 返回更新后的文章实体
   * @throws NotFoundException - 当文章不存在时抛出异常
   */
  async favoriteArticle(articleId: number, userId: number): Promise<Article> {
    const article = await this.getArticleById(articleId);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    article.favoritedBy = [...article.favoritedBy, user];
    return await this.articleRepository.save(article);
  }
  /**
   * 用户取消收藏文章
   * @param articleId - 文章ID
   * @param userId - 用户ID
   * @returns 返回更新后的文章实体
   * @throws NotFoundException - 当文章不存在时抛出异常
   */
  async unfavoriteArticle(articleId: number, userId: number): Promise<Article> {
    const article = await this.getArticleById(articleId);
    article.favoritedBy = article.favoritedBy.filter(
      (user) => user.id !== userId,
    );
    return await this.articleRepository.save(article);
  }
  /**
   * 更新文章信息
   * @param id - 文章ID
   * @param dto - 更新文章的数据传输对象
   * @returns 返回更新后的文章实体
   * @throws NotFoundException - 当文章不存在时抛出异常
   */
  async updateArticle(id: number, dto: UpdateArticleDto): Promise<Article> {
    const article = await this.getArticleById(id);
    Object.assign(article, dto);
    return await this.articleRepository.save(article);
  }

  /**
   * 删除文章
   * @param id - 文章ID
   * @throws NotFoundException - 当文章不存在时抛出异常
   */
  async deleteArticle(id: number): Promise<void> {
    const article = await this.getArticleById(id);
    await this.articleRepository.remove(article);
  }
}
