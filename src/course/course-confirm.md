## 课程上传完成确认
### 基本信息
* 接口描述: 课程上传完成后提交课程元数据并确认上传完成
* 请求方法: POST
* 请求路径: /api/course/confirm
* 需要认证: 是
* 内容类型: application/json

### 请求参数
| 参数名 | 类型 | 位置 | 必填 | 描述 |
| ----- | ----- | ----- | ----- | ----- |
| fileId | string | body | 是 | s3临时id |
| title | string | body | 是 | 课程标题(最长100个字符) |
| description | string | body | 否 | 描述
| categoryId | number | body |否 | 分类ID 
| tags | number array | body | 否 | 课程标签数组 |
> url待定，可能是s3 url或者临时id

### 返回参数
| 参数名 | 类型 | 描述 |
| ----- | ----- | ----- |
| code | number | 状态码(200成功) |
| message | string | 状态描述 |
| data | object | 响应数据 |
| data.courseId | string | 正式课程ID |
| data.url | string | 课程访问地址|
| data.duration | number |课程时长(秒)|
|data.createdAt |string|创建时间|

### 响应实例
```
{
  "code": 200,
  "message": "success",
  "data": {
    "courseId": "cid-87654321",
    "url": "https://example.com/courses/cid-87654321",
    "duration": 245,
    "createdAt": "2025-03-30T10:30:15Z"
  }
}
```
