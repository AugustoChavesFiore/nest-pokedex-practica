import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  private defaultLimit:number

  constructor(
    @InjectModel(Pokemon.name)
    private readonly PokemonModel: Model<Pokemon>,
    private readonly configServices:ConfigService,
  ) { 
    this.defaultLimit = configServices.get<number>('defaultLimit');
  }


  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.PokemonModel.create(createPokemonDto);
      return pokemon;

    } catch (error) {
      this.handleExceptions(error);
    };

  };

  async findAll(paginationDto:PaginationDto) {
    const {limit = this.defaultLimit, offset = 0} = paginationDto
    
    return this.PokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({no:1})
    .select('-__v')


  };

  async findOne(term: string) {
    let pokemon: Pokemon;
    if (!isNaN(+term)) {
      pokemon!! = await this.PokemonModel.findOne({ no: term });
    } else if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.PokemonModel.findById(term);

    } else {
      pokemon = await this.PokemonModel.findOne({ name: term.toLocaleLowerCase() });
    };
    if (!pokemon) throw new NotFoundException(`Pokemon whit id, name or no "${term}" not exists`);
    return pokemon;
  };

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    };

    try {
      await pokemon.updateOne(updatePokemonDto,{new:true});
      return {...pokemon.toJSON(), ...updatePokemonDto};
      
    } catch (error) {
        this.handleExceptions(error);
    }


  };

  async remove(id: string) {
    // const result = await this.PokemonModel.findByIdAndDelete( id );

    const {deletedCount, acknowledged} = await this.PokemonModel.deleteOne({_id:id});
    if(deletedCount ===0){
      throw new  BadRequestException(`Pokemon whit id "${id}" not found`);
    };

    return;
  };



  private handleExceptions(error:any){
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);
    };
    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
  }
}
