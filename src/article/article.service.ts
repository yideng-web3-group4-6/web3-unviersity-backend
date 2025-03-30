import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async createArticle(
    dto: CreateArticleDto,
    authorId?: number,
  ): Promise<Article> {
    const article = this.articleRepository.create(dto);
    if (authorId) {
      article.author = { id: authorId } as any;
    }
    return await this.articleRepository.save(article);
  }

  async getArticleById(id: number): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    return article;
  }

  async getAllArticles(): Promise<Article[]> {
    return await this.articleRepository.find({ relations: ['author'] });
  }

  async updateArticle(id: number, dto: UpdateArticleDto): Promise<Article> {
    const article = await this.getArticleById(id);
    Object.assign(article, dto);
    return await this.articleRepository.save(article);
  }

  async deleteArticle(id: number): Promise<void> {
    const article = await this.getArticleById(id);
    await this.articleRepository.remove(article);
  }
}
