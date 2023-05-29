import React, {useState, useEffect, useRef} from 'react';//useEffect:Para criar um ciclo de vida.
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Modal, Image } from 'react-native';
import { Camera } from 'expo-camera';//dependencia com a camera para react-native
import { FontAwesome } from '@expo/vector-icons';//icones vem já do expo
import * as MediaLibrary from 'expo-media-library';//exporta galeria do celuylar


export default function App() {
  const camRef = useRef(null)//useRef: usado para referencia algo se necessario
  const [type, settype] = useState(Camera.Constants.Type.back)//back:primeiro a camera de trás traseira
  const [hasPermission, setHaspermission] = useState(null)//permissão se pode usar ou não por state
  const [capturedPhoto, setCapturedPhoto] = useState(null)
  const [open, setOpen] = useState(false)//inicia falso a modal fechada

  useEffect(() =>{
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();//pega o status com async await requestPermissionsAsync
      setHaspermission(status === 'granted');//aparece um modal de aviso perguntando se aceito ligar a camera
    })();

    (async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();//permissão de salvar a foto
    setHaspermission(status === 'granted');//um controle se quer aceitar ou não a permissão de salvar a foto
    })();

    //(async () => {
    //  const { status } = await Permissions.askAsync(Permissions.CAMERA);//pega o status com async da pernissão camera roll
    //  setHaspermission(status === 'granted');//aparece um modal de aviso perguntando se aceito salvar fotos no celular
    //})();
  }, []);

  if(hasPermission === null){
    return <View/>//retorna apenas uma view vazia do react-native
  }

  if(hasPermission === false){
    return <Text>acesso negado! </Text>
  }

  async function takePicture(){//função logica de tirar foto
    if(camRef){
      const data = await camRef.current.takePictureAsync();//takePictureAsync metodo para tirar a foto
      setCapturedPhoto(data.uri);//uri propriedade com a foto em si
      setOpen(true);//abrindo a modal

    }
  }

  async function savePicture(){//função logica da foto
    const asset = await MediaLibrary.createAssetAsync(capturedPhoto)//coloca state pegar foto em MediaLibrary na sua galeria do celular
    .then(() => {//caso salve a foto cai dentro desse then
      alert('Foto Salvo com sucesso!')
      console.log('SALVO', asset );
    })
    .catch(error => {
      console.log('err', error );
    })
  }
  

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={{flex: 1}}
        type={type}
        ref={camRef}
      >{/*type:tipo de camera*/}
        <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row' }}>
          <TouchableOpacity style={{ 
            position: 'absolute',
            bottom: 20,
            left: 20,
            }}
            onPress={ () => {
              settype(
                type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                :
                Camera.Constants.Type.back
              )
            }}
            >
              <Text style={{fontSize:20, marginBottom: 13, color: '#c521b8'}}>Trocar de Camera</Text>
          </TouchableOpacity>{/*botão para trocar de camera para frontal*/}
        </View>
      </Camera>

      <TouchableOpacity style={styles.button}  onPress={ takePicture }>{/*botão para tirar foto, Edita botão usando o StyleSheet.create.*/}
            <FontAwesome name="camera" size={23} color="#FFF"/>{/*icone de camera*/}
      </TouchableOpacity>

      { capturedPhoto && 
        <Modal
          animationType='slide'
          transparent={false}
          visible={open}
        >
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', margin: 20}}>
            <View style={{flexDirection: 'row', margin: 10}}>
            <TouchableOpacity style={{margin: 10}} onPress={ ()=> setOpen(false) }>
              <FontAwesome name="window-close" size={50} color="#FF0000" />
            </TouchableOpacity>

            <TouchableOpacity style={{margin: 10}} onPress={ savePicture }>
              <FontAwesome name="upload" size={50} color="#121212" />
            </TouchableOpacity>
            </View>

            <Image
              style={{ width: '100%', height: 450, borderRadius: 20}}
              source={{ uri: capturedPhoto }}//imagem pegando com state da foto
            />
          </View>
        </Modal>
      }{/*modal vai aparecer mostrando a foto batida,,visible:mostra o modal colm a foto,,TouchableOpacity botão para fechar a modal*/}
    </SafeAreaView>
  );//name="upload":botão de salvar a foto batida
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  button:{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    margin: 20,
    borderRadius: 10,
    height: 50,
  }
});