import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { SearchArticleDto } from './dto/search-article.dto';
import { ArticleItemReturnDto, ArticleListReturnDto } from './dto/return.dto';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Article')
@Controller('article')
@UseGuards(AuthGuard('jwt'))
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new article' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateArticleDto })
  @ApiResponse({ status: 201, description: 'Article created successfully' })
  async createArticle(@Body() dto: CreateArticleDto, @Req() req) {
    const user = req.user;
    console.log('user????', user);
    return await this.articleService.createArticle(dto, user.walletAddress);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get article by ID' })
  @ApiParam({ name: 'id', description: 'Article ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Article retrieved successfully',
    type: SearchArticleDto,
  })
  async getArticleById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ArticleItemReturnDto> {
    return await this.articleService.getArticleById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({ status: 200, description: 'Articles retrieved successfully' })
  async getAllArticles() {
    return await this.articleService.getAllArticles();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an article' })
  @ApiParam({ name: 'id', description: 'Article ID', example: 1 })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateArticleDto })
  @ApiResponse({ status: 200, description: 'Article updated successfully' })
  async updateArticle(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateArticleDto,
    @Req() req,
  ) {
    const user = req.user;
    const article = await this.articleService.getArticleById(id);
    if (
      !article.author ||
      (article.author.id !== user.id && user.role !== 'admin')
    ) {
      throw new ForbiddenException(
        'You are not authorized to update this article',
      );
    }
    return await this.articleService.updateArticle(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an article' })
  @ApiParam({ name: 'id', description: 'Article ID', example: 1 })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Article deleted successfully' })
  async deleteArticle(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user;
    const article = await this.articleService.getArticleById(id);
    if (
      !article.author ||
      (article.author.id !== user.id && user.role !== 'admin')
    ) {
      throw new ForbiddenException(
        'You are not authorized to delete this article',
      );
    }
    await this.articleService.deleteArticle(id);
    return { message: `Article ${id} deleted successfully` };
  }

  @Get('search')
  @ApiOperation({ summary: 'Get articles by conditions' })
  @ApiBody({
    type: SearchArticleDto,
    description: '搜索条件',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Articles retrieved successfully',
    type: ArticleListReturnDto,
  })
  async getArticlesByConditions(
    @Body() searchArticleDto: SearchArticleDto,
  ): Promise<ArticleListReturnDto> {
    return await this.articleService.searchArticlesByConditions(
      searchArticleDto,
    );
  }

  @Get('like/:id')
  @ApiOperation({ summary: 'Get liked articles' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Articles retrieved successfully' })
  async likeArticle(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user;
    if (!user) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }
    return await this.articleService.likeArticle(id, user.id);
  }

  @Get('unlike/:id')
  @ApiOperation({ summary: 'Get unliked articles' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Articles retrieved successfully' })
  async unlikedArticle(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user;
    if (!user) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }
    return await this.articleService.unlikeArticle(id, user.id);
  }

  @Get('favorite/:id')
  @ApiOperation({ summary: 'Get favorited articles' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Articles retrieved successfully' })
  async favoritedArticle(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user;
    if (!user) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }
    return await this.articleService.favoriteArticle(id, user.id);
  }

  @Get('unfavorite/:id')
  @ApiOperation({ summary: 'Get unfavorited articles' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Articles retrieved successfully' })
  async unfavoritedArticle(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user;
    if (!user) {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }
    return await this.articleService.unfavoriteArticle(id, user.id);
  }
}
