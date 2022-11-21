import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import Gallery from "react-grid-gallery";
import { BASE_URL, TOKEN_KEY } from "../constants";


const captionStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    maxHeight: "240px",
    overflow: "hidden",
    position: "absolute",
    bottom: "0",
    width: "100%",
    color: "white",
    padding: "2px",
    fontSize: "90%"
};

const wrapperStyle = {
    display: "block",
    minHeight: "1px",
    width: "100%",
    border: "1px solid #ddd",
    overflow: "auto"
};

function PhotoGallery(props) {
    const [images, setImages] = useState(props.images);
    const [imageIndex, setImageIndex] = useState(0);
    console.log("err in 33")
    var imageArr = images.map( image => {
        return {
            ...image,
            customOverlay: (
                <div style={captionStyle}>
                    <div>{`${image.user}: ${image.caption}`}</div>
                </div>
            )
        }
    });

    const onDeleteImage = () => {
        if (window.confirm(`Do you want to delete?`)) {
            const img = images[imageIndex];
            const newImageArr = images.filter((image, index) => index !== imageIndex);
            console.log('delete image ', newImageArr);

            // // edge case
            // if (newImageArr.length === 0) {
            //     newImageArr =
            // }
            const opt = {
                method: 'DELETE',
                url: `${BASE_URL}/post/${img.postId}`,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
                }
            };

            axios(opt)
                .then( res => {
                    console.log('delete result -> ', res);
                    // case1: success
                    if(res.status === 200) {
                        // step1: set state
                        console.log("execute")
                        console.log(typeof newImageArr)
                        setImages(newImageArr);
                        console.log("not reached")
                    }
                })
                .catch( err => {
                    // case2: fail
                    message.error('Fetch posts failed!');
                    console.log('fetch posts failed: ', err.message);
                })
        }
    }

    const onCurrentImageChange = index => {
        console.log('curIdx ', index);
        setImageIndex(index)
    }

    useEffect(() => {
        console.log("gallery use effect")
        setImages(props.images)
    }, [props.images])

    if (!imageArr || imageArr.length === 0) {
        return <div>No data</div>;
    } else {
        return (
            <div style={wrapperStyle}>
                <Gallery
                    images={imageArr}
                    enableImageSelection={false}
                    backdropClosesModal={true}
                    currentImageWillChange={onCurrentImageChange}
                    customControls={[
                        <Button style={{marginTop: "10px", marginLeft: "5px"}}
                                key="deleteImage"
                                type="primary"
                                icon={<DeleteOutlined />}
                                size="small"
                                onClick={onDeleteImage}
                        >Delete Image</Button>
                    ]}
                />
            </div>
        );
    }
    // return (
    //     <div style={wrapperStyle}>
    //         <Gallery
    //             images={imageArr}
    //             enableImageSelection={false}
    //             backdropClosesModal={true}
    //             currentImageWillChange={onCurrentImageChange}
    //             customControls={[
    //                 <Button style={{marginTop: "10px", marginLeft: "5px"}}
    //                         key="deleteImage"
    //                         type="primary"
    //                         icon={<DeleteOutlined />}
    //                         size="small"
    //                         onClick={onDeleteImage}
    //                 >Delete Image</Button>
    //             ]}
    //         />
    //     </div>
    // );
}

PhotoGallery.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.shape({
            postId: PropTypes.number.isRequired,
            user: PropTypes.string.isRequired,
            caption: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
            thumbnail: PropTypes.string.isRequired,
            thumbnailWidth: PropTypes.number.isRequired,
            thumbnailHeight: PropTypes.number.isRequired,
        })
    ).isRequired
};

export default PhotoGallery;