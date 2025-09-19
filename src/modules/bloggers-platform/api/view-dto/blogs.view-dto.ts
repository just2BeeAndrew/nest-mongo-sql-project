

export class BlogsViewDto {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;

  static mapToView(blog: any): BlogsViewDto {
    const dto = new BlogsViewDto();

    dto.id = blog.id.toString();
    dto.name = blog.name;
    dto.description = blog.description;
    dto.websiteUrl = blog.website_гrl;
    dto.createdAt = blog.created_at.toISOString();
    dto.isMembership = blog.is_membership;

    return dto;
  }
}