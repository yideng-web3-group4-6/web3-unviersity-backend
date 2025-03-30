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
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new article' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiBody({ type: CreateArticleDto })
  @ApiResponse({ status: 201, description: 'Article created successfully' })
  async createArticle(@Body() dto: CreateArticleDto, @Req() req) {
    const user = req.user;
    return await this.articleService.createArticle(dto, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get article by ID' })
  @ApiParam({ name: 'id', description: 'Article ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Article retrieved successfully' })
  async getArticleById(@Param('id', ParseIntPipe) id: number) {
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
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
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
}
