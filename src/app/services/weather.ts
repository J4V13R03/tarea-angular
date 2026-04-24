import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Weather {
  apiKey: string = 'e7f5a7974d3c2226936512aba7480088';
  URI: string = 'https://api.openweathermap.org/data/2.5/weather?appid=${this.apiKey}&units=metric&q=';


  constructor(private http: HttpClient) {}

  getWeather(city: string, country: string) {
    console.log('Obteniendor clima para: ${city},${country}');
    return this.http.get(this.URI + `${city},${country}`);
  }

}
