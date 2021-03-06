import React, { useCallback, useEffect, useState } from "react";
import getCurrentWeather from "../src/Service/getCurrentWeather";
import getHourlyWeather from "../src/Service/getHourlyWeather";
import { useRouter } from "next/router";
import HourlyTime from "../src/Components/Container/Hourly/HourlyTime";
import { DEAFAULT_CITY } from "../src/Service/config";

const HourlyWeather = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [city,setCity] = useState('');
    const [today, setToday] = useState<any[]>([]);
    const [tomorow, setTomorow] = useState<any[]>([]);
    useEffect(() => {
        if (router.query['city']) {
            setCity(String(router.query['city']));
        }
        // else if(router.query['city'] === null){
        //     console.log("không có gì để hiển thị")
        // }
        else {
            setCity(DEAFAULT_CITY) 
        }
    }, [router.query]);
    useEffect(() => {
        setLoading(true);
        getCurrentWeather(city)
             .then(res => {
                  setCity(res.data.name)
                  if (res.data.coord.lat && res.data.coord.lon) {
                       getHourlyWeather(res.data.coord.lat, res.data.coord.lon)
                       .then(res => {
                        setToday(res.data.hourly.slice(1,23))
                        setTomorow(res.data.hourly.slice(24,47))
                        })
                    }
             })
             .finally(() => setLoading(false));
    
   },[city])
    if (loading) return <div>Loading...</div>;
    return (
        <>
            <HourlyTime 
                title="Hôm Nay"
                dataHourly = {today?.map((item:any) => {
                    return {
                        time:item.dt,
                        temp:item.temp,
                        iconUrl:item.weather[0].icon,
                        status:item.weather[0].main,
                        wind_speed:item.wind_speed,
                        humidity:item.humidity,
                        cloud:item.clouds,
                        uvi:item.uvi,
                        pressure:item.pressure
                    }
                })} 
            />
            <HourlyTime 
                title="Ngày Mai"
                dataHourly = {tomorow?.map((item:any) => {
                    return {
                        time:item.dt,
                        temp:item.temp,
                        iconUrl:item.weather[0].icon,
                        status:item.weather[0].main,
                        wind_speed:item.wind_speed,
                        humidity:item.humidity,
                        cloud:item.clouds,
                        uvi:item.uvi,
                        pressure:item.pressure
                    }
                })} 
            />
        </>
    );
}
export default HourlyWeather;