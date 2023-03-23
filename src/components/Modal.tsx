import { saveAs } from 'file-saver';

export default function Modal(props: {imgSource: string, setSelectedImage: React.Dispatch<React.SetStateAction<string>>}){

    let blob = new Blob([props.imgSource], {type: 'image/png'})

    console.log(URL.createObjectURL(blob))
    // console.log(props.imgSource)
    console.log(blob)

    return(
        <div className="modal-background">
            <div className="modal-container">
                <img src={props.imgSource} className="modal-img"/>
                {/* <button onClick={() => saveAs(blob, "image")}>Save</button> */}
                <span className="close-button" onClick={() => props.setSelectedImage('')}>X</span>
            </div>
        </div>
    )
}