// import { Injectable } from '@nestjs/common';
// import { SessionsViewDto } from '../../api/view-dto/sessions.view-dto';
//
// @Injectable()
// export class SessionsQueryRepository {
//   constructor(
//   ) {}
//
//   async getAllSessions(userId: string): Promise<SessionsViewDto[]> {
//     const sessions = await this.SessionModel.find({ userId: userId }).exec();
//
//     const sessionDtos = sessions.map((session) =>
//       SessionsViewDto.mapToView(session),
//     );
//
//     return sessionDtos;
//   }
// }
