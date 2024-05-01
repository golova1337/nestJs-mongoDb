import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './services/project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Roles } from 'src/utils/common/guard/roles/roles.decorator';
import { Request } from 'express';
import { Response } from '../helpers/response/Response';
import { responseSuccesfully } from 'src/helpers/types/response-type';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/utils/common/guard/roles/roles.guard';
import { AccessProjectDto } from './dto/access-project.dto';

@ApiBearerAuth()
@ApiTags('projects')
@UseGuards(RolesGuard)
@Controller('v1/api/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles('user')
  @ApiBody({ type: CreateProjectDto })
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: Request,
  ): Promise<responseSuccesfully> {
    const userId = req.user['id'];

    // run service
    const result = await this.projectService.create(
      {
        ...createProjectDto,
      },
      userId,
    );

    //create response
    return Response.succsessfully(result);
  }

  @Get()
  @Roles('user')
  async findAll(@Req() req: Request): Promise<responseSuccesfully> {
    // get condition
    const query = req.query;
    const userId = req.user['id'];
    const condition = { ...query, userId };

    // run service
    const result = await this.projectService.findAll(condition);

    //create response
    return Response.succsessfully(result);
  }

  @Get(':id')
  @Roles('user')
  async findOne(@Param('id') id: string): Promise<responseSuccesfully> {
    // run service
    const result = await this.projectService.findOne(id);

    //create response
    return Response.succsessfully(result);
  }

  @Patch(':id')
  @Roles('user')
  @ApiBody({ type: UpdateProjectDto })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<responseSuccesfully> {
    //run service
    const result = await this.projectService.update(id, updateProjectDto);

    //crete reaponse
    return Response.succsessfully(result);
  }

  @Delete('/delete')
  @Roles('user')
  async remove(
    @Body('ids') ids: string[],
    @Req() req: Request,
  ): Promise<responseSuccesfully> {
    const userId = req.user['id'];

    // run service
    const result = await this.projectService.remove(userId, ids);

    //create response
    return Response.succsessfully(result);
  }

  @Post(':projectId/access')
  @Roles('user')
  async access(
    @Body() collaborators: AccessProjectDto,
    @Param('projectId') projectId: string,
  ): Promise<responseSuccesfully> {
    //run service
    const result = await this.projectService.access(collaborators, projectId);
    //return reasponse
    return Response.succsessfully(result);
  }

  @Get(':projectId/access/:invitationToken')
  @Roles('user')
  async gainAccess(
    @Param() params: { projectId: string; invitationToken: string },
  ): Promise<responseSuccesfully> {
    // run service
    const result = await this.projectService.gainAccess(params);

    //return reasponse
    return Response.succsessfully(result);
  }
}
