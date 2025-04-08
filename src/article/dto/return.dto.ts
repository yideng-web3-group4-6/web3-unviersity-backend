// import second from 'first'
import { Article } from '../entities/article.entity';
import { User } from '../../user/entities/user.entity';

export class CommonListReturnWithPaginationDto<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 文章返回
 */
export class ArticleItemReturnDto extends Article {
  author: User;
  favoritedBy: User[];
  likedBy: User[];
}

/**
 * 文章列表返回
 */
export class ArticleListReturnDto extends CommonListReturnWithPaginationDto<ArticleItemReturnDto> {}
