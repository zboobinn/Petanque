import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  create(@Body() createGameDto: any) {
    return this.gamesService.createGame(createGameDto);
  }

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.gamesService.updateGame(+id, updateData);
  }
}