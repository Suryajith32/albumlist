import { Box, ButtonBase, Card, CardContent, CardMedia, Grid, Paper, Stack, Typography } from '@mui/material'
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import recentDataService from '../../services/recentServices'
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useReducer, useState } from 'react'
import './album.css'
import { useDispatch } from 'react-redux'
import { playing, songIndex, pause, Play, musicRef, play } from '../../reducers/PlayerReducer'
import { useSelector } from 'react-redux';
import favDataService from '../../services/favServices'
import styled from '@emotion/styled';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

function AlbumList(props) {
    const dispatch = useDispatch()
    const [isPlay, setIsPlay] = useState(false)
    const [smlBanner, setSmlBanner] = useState()
    const [bannerTitle, setBannerTitle] = useState()
    const [artistname, setArtistName] = useState()
    const [music, setMusic] = useState()
    const [email, setEmail] = useState()
    const [currentSong, setCurrentSong] = useState()
    const [favmusic, setFavMusic] = useState()
    const [favName,setFavName] = useState();
    const [reducerValue, forceUpdate] = useReducer(x => x + 1, 0)

    useEffect(() => {
        CheckAllFav()
        console.log("props", props)
        setMusic(props.filteredData)
        setSmlBanner(props.albumdata.imageurl)
        setBannerTitle(props.albumdata.albumname)
        setArtistName(props.albumdata.artist)
        setEmail(localStorage.getItem("email"))
        console.log("email", email)
    }, [reducerValue])
     
     const CheckAllFav = async()=>{
        const unId = localStorage.getItem("email")
        const favMusic = await favDataService.getAllfav()
        const data = favMusic?.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        const fil = data && data?.filter(n => n.email === unId)
        setFavMusic(fil)
        console.log(fil, "filterred")
        const SongName = fil && fil?.map((doc)=>{
        return doc.song
        })
        setFavName(SongName)
     }


    const handleClickPLay = async (id, e, index, item) => {
        console.log("music", e)
        setIsPlay(!isPlay)
        setCurrentSong(item)
        const rec = {
            ...item,
            email
        }
        if (!isPlay) {
            await recentDataService.addRecent(rec)
            console.log(index)
            dispatch(play(true))
            dispatch(playing(e))
            dispatch(songIndex(index))
            dispatch(musicRef(id))
            console.log("whyyyyyyyyyyyyy")
        } else {
            dispatch(pause(true))
        }
    }
    const handleFav = async(e) => {
        const check = favName && favName?.includes(e.song)
        if(!check){
            const fav = {
                ...e,
                email
            }
            console.log("merged data", fav)
            await favDataService.addfav(fav)
            forceUpdate()
        }else{
            const Unlike = favmusic&&favmusic?.filter((n)=>n.song ===e.song)
            console.log("unlike",Unlike)
            await favDataService.deletefav(Unlike[0]?.id)
            forceUpdate()
        }

    }
    return (
        <div>
            <Box height="40vh" sx={{ bgcolor: "rgba(0, 0, 0,0.31)", mt: 5 }}>
                <Paper
                    sx={{
                        p: 2,
                        margin: 'auto',
                        maxWidth: 500,
                        flexGrow: 1,
                        backgroundColor: "transparent"
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item>
                            <ButtonBase sx={{ width: 128, height: 128,ml:2 }}>
                                <Img alt="complex" src={smlBanner} />
                            </ButtonBase>
                        </Grid>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                                <Grid item xs>
                                    <Typography variant="h3" sx={{
                                        color: '#FFFFFF', top: '110px',
                                        fontWeight: 600,
                                        ml:1,
                                    }}>{bannerTitle}</Typography>
                                    <Typography variant="h5" sx={{
                                        display: { xs: "none", sm: "block" },
                                        color: '#FFFFFF',
                                        fontWeight: 600,
                                        opacity: 0.5,
                                    }}>{artistname}</Typography>

                                </Grid>
                                <Grid item>
                                </Grid>
                            </Grid>
                            <Grid item>

                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
            <Card sx={{ mt: 2, background: "rgba(0, 0, 0,0.31)" }}>
                <CardContent style={{ overflow: 'auto', background: "rgba(0, 0, 0,0.31)" }}>
                    <Box sx={{ maxHeight: '100vh', left: 0 }} >
                        {music && music?.map((item, index) => (
                            <Box key={index} sx={{ mt: 4 }}>
                                <Stack direction="row" spacing={0} justifyContent="space-between" >
                                    <Box>
                                        <Stack direction="row" spacing={0} justifyContent="space-between" >
                                            <Typography color="#FFFFFF" sx={{ fontSize: 13, mt: 2 }}> </Typography>
                                            <Box sx={{ height: 20, width: 80, bgcolor: "#FFFFFF", borderRadius: 2, ml: 2 }}>
                                                <CardMedia
                                                    component="img"
                                                    height="60"
                                                    image={item.imageurl}
                                                    alt="Artists"
                                                />
                                            </Box>
                                            <Box>
                                                <Typography style={{ fontSize: 14, fontWeight: 400, }} color="#FFFFFF" sx={{
                                                    ml: 1, mt: 1
                                                }} >{item.song}</Typography>
                                                <Typography sx={{ display: { xs: "none", sm: "block" } }} style={{ fontSize: 12, fontWeight: 400, }} color="#FFFFFF" sx={{
                                                    ml: 1,
                                                }} >{item.artist}</Typography>
                                            </Box>
                                        </Stack>
                                    </Box>
                                    <Box sx={{ display: { xs: "none", sm: "block" } }} >
                                        <Typography style={{ fontSize: 14, fontWeight: 400, }} color="#FFFFFF" sx={{
                                            ml: 1, mt: 1
                                        }} ></Typography>
                                    </Box>
                                    <Box >
                                        <Box sx={{ mt: 1 }}>
                                            <Grid
                                                container
                                                direction="row"
                                                justifyContent="flex-end"
                                                alignItems="center"
                                            >
                                                <button className='play-btn' onClick={() => handleFav(item)}>{favName&&favName?.includes(item.song)? <FavoriteIcon sx={{ mr: 8, color: "#FFFFFF" }} /> : <FavoriteBorderIcon sx={{ mr: 8, color: "#FFFFFF" }} />}</button>
                                                <button onClick={() => handleClickPLay(item.musicUrl, music, index, item)} className='play-btn'>
                                                    {/* <audio src={currentSong} ref={audioElm} /> */}
                                                    {currentSong === item && isPlay ? <PauseCircleFilledIcon sx={{ mr: 8, color: "#FFFFFF" }} /> : <PlayCircleFilledIcon sx={{ mr: 8, color: "#FFFFFF" }} />}
                                                </button>
                                            </Grid>
                                        </Box>
                                    </Box>
                                </Stack>
                            </Box>
                        ))}
                    </Box>
                </CardContent>
            </Card>
        </div>
    )
}

export default AlbumList