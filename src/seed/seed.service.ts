import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/httpadapters/axios.adapter';

@Injectable()
export class SeedService {
 
  constructor(
    @InjectModel(Pokemon.name)
    private readonly PokemonModel: Model<Pokemon>,
    private readonly http:AxiosAdapter,
  ) { };

  async executeSEED() {
    await this.PokemonModel.deleteMany();

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=600');

    const pokemons = data.results.map(({ name, url }) => (
      {
        no: + url.split('/')[6],
        name
      }
    ));
    await this.PokemonModel.insertMany(pokemons);
    return 'Seed Executed';
  };

  
}
