"use client";
import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "../userpage.module.css";
import "../../../globals.css";
import {
  Timestamp,
  arrayRemove,
  deleteDoc,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import { app } from "@/firebase-config";
import html2canvas from "html2canvas";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  Postit,
  Textbox,
  WhiteboardImage,
  WhiteboardLink,
} from "../../../Types";
import { v4 } from "uuid";

import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import { PostIt } from "../WhiteboardComponents/PostIt";
import { Text } from "../WhiteboardComponents/Text";
import { Image } from "../WhiteboardComponents/Image";
import { textShadow } from "html2canvas/dist/types/css/property-descriptors/text-shadow";
import { WBLink } from "../WhiteboardComponents/WBLink";
const ResponsiveGridLayout = WidthProvider(Responsive);
import axios from "axios";

const Widget = (props: {
  projectid: string;
  widgetid: string;
  date: Timestamp;
  priority: string;
  layout: string;
  newPostits: string;
  newTextbox: string;
  widgetimages: string[];
  widgetindex: string[];
  newBoardImages: string;
  prioritySetter: Function;
  newLinks: string;
}) => {
  const { widgetid, date } = props;

  const monthNames = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  type GalleryImage = {
    contentUrl: string;
  };

  const month = monthNames[date.toDate().getMonth()];
  const day = date.toDate().getUTCDate();

  const widgetDate = day + " " + month;
  const [show, setShow] = useState(false);
  const [layout, setLayout] = useState<Layout[]>([]);
  const [postit, setPostit] = useState<Postit[]>([]);
  const [textbox, setTextbox] = useState<Textbox[]>([]);
  const [boardImage, setBoardImage] = useState<WhiteboardImage[]>([]);
  const [link, setLink] = useState<WhiteboardLink[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [gallerySearchBox, setGallerySearchBox] = useState(false);
  const [gallerySearchImages, setGallerySearchImages] = useState(false);
  const [linkSearchBox, setLinkSearchBox] = useState(false);

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (props.layout) {
      setLayout(JSON.parse(props.layout));
    }
    if (props.newPostits) {
      setPostit(JSON.parse(props.newPostits));
    }
    if (props.newTextbox) {
      setTextbox(JSON.parse(props.newTextbox));
    }
    if (props.newBoardImages) {
      setBoardImage(JSON.parse(props.newBoardImages));
    }
    if (props.newLinks) {
      setLink(JSON.parse(props.newLinks));
    }
  }, [show, props.widgetid, props.layout]);

  useEffect(() => {
    setImages(props.widgetimages);
  }, [props.widgetimages]);

  const db = getFirestore(app) as any;
  const deleteWidget = async () => {
    const widgetRef = doc(db, "widgets", widgetid);
    await deleteDoc(widgetRef);
  };

  const widgetPriority = async (priorityValue: string) => {
    const widgetRef = doc(db, "widgets", widgetid);
    await updateDoc(widgetRef, { priority: priorityValue });
    props.prioritySetter(priorityValue);
  };

  const handleClose = () => {
    setImages((prevState) => {
      let nextState = [...prevState];
      return nextState;
    });
    setShow(false);
  };
  const handleShow = (e: any) => {
    if (e.detail == 2) {
      setShow(true);
    }
  };

  const widgetLayout = async (
    currentlayout: Layout[],
    currentpostits: Postit[],
    currenttextboxes: Textbox[],
    currentBoardImages: WhiteboardImage[],
    currentLinks: WhiteboardLink[]
  ) => {
    const input = document.querySelector<HTMLDivElement>(".whiteboard__photo");
    if (input) {
      html2canvas(input, {
        logging: true,
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("img/png");
        uploadToStorage(imgData);
      });
    }
    const allLayouts = JSON.stringify(currentlayout);
    const allPostits = JSON.stringify(currentpostits);
    const allTextboxes = JSON.stringify(currenttextboxes);
    const allBoardImages = JSON.stringify(currentBoardImages);
    const allLinks = JSON.stringify(currentLinks);

    const widgetRef = doc(db, "widgets", widgetid);
    await updateDoc(widgetRef, {
      layout: allLayouts,
      postits: allPostits,
      textboxes: allTextboxes,
      boardImages: allBoardImages,
      links: allLinks,
    });
    handleClose();
  };

  const uploadToStorage = async (imgData: any) => {
    const blob = await (await fetch(imgData)).blob();
    const storage = getStorage();
    const filePath = `/widgets/${widgetid}.jpeg`;
    const storageRef = ref(storage, filePath);
    uploadBytes(storageRef, blob).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
  };

  const createText = () => {
    const uuid = v4();
    const newTextbox = { id: uuid, text: "" };
    const newTextboxArray = [...textbox, newTextbox];
    const newLayoutArray = [
      ...layout,
      { w: 2, h: 1, x: 1, y: 1, i: uuid, moved: false, static: false },
    ];
    setTextbox(newTextboxArray);
    setLayout(newLayoutArray);
  };

  const createPostit = () => {
    const uuid = v4();
    const newPostit = { id: uuid, postittext: "" };
    const newPostitArray = [...postit, newPostit];
    const newLayoutArray = [
      ...layout,
      { w: 1, h: 1, x: 1, y: 1, i: uuid, moved: false, static: false },
    ];
    setPostit(newPostitArray);
    setLayout(newLayoutArray);
  };

  const createImage = (image: File) => {
    const uuid = v4();
    if (image) {
      const storage = getStorage();
      const filePath = `/widgets/${props.widgetid}/${uuid}.jpeg`;
      const storageRef = ref(storage, filePath);
      uploadBytes(storageRef, image)
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          const newImage = { id: uuid, url: downloadURL };
          const newImageArray = [...boardImage, newImage];
          const newLayoutArray = [
            ...layout,
            { w: 1, h: 1, x: 1, y: 1, i: uuid, moved: false, static: false },
          ];
          setBoardImage(newImageArray);
          setLayout(newLayoutArray);
        });
    }
  };

  // const createWebImage = async (searchText: string) => {
  //   let subscriptionKey = "67a8b1498dd548a18240387134bfe126";
  //   const response = await axios(
  //     "https://api.bing.microsoft.com/v7.0/search" +
  //       "?q=" +
  //       encodeURIComponent(searchText),
  //     {
  //       method: "get",
  //       headers: {
  //         "Ocp-Apim-Subscription-Key": subscriptionKey,
  //       },
  //       params: {
  //         safesearch: "Moderate",
  //         count: "12",
  //         Pragma: "no-cache",
  //         maxFileSize: "300000",
  //       },
  //     }
  //   );

  const searchImageInput = useRef<HTMLInputElement>(null);
  const createWebImage = async () => {
    if (searchImageInput.current!.value.length > 0) {
      const searchText = searchImageInput.current!.value;
      let subscriptionKey = process.env.NEXT_PUBLIC_IMAGE_API;
      const response = await axios(
        "https://api.cognitive.microsoft.com/bing/v7.0/images/search" +
          "?q=" +
          encodeURIComponent(searchText),
        {
          method: "get",
          headers: {
            "Ocp-Apim-Subscription-Key": subscriptionKey,
          },
          params: {
            safesearch: "Moderate",
            count: "8",
            Pragma: "no-cache",
            maxFileSize: "300000",
          },
        }
      );
      setGalleryImages(response.data.value);
      setGallerySearchBox(false);
      //     gallerySearchBox, setGallerySearchBox] = useState(false);
      // const [gallerySearchImages,
    }
  };

  const selectGalleryImage = (e: any) => {
    console.log(e.target.value);
  };

  const linkName = useRef<HTMLInputElement>(null);
  const linkUrl = useRef<HTMLInputElement>(null);
  const createLink = () => {
    const nameInput = linkName.current!.value;
    const urlInput = linkUrl.current!.value;
    const uuid = v4();
    const newLink = { id: uuid, name: nameInput, url: urlInput };
    const newLinkArray = [...link, newLink];
    const newLayoutArray = [
      ...layout,
      { w: 1, h: 1, x: 1, y: 1, i: uuid, moved: false, static: false },
    ];
    setLink(newLinkArray);
    setLayout(newLayoutArray);
  };

  const widgetImage = () => {
    const array = props.widgetindex;
    const index = array.indexOf(props.widgetid);
    console.log(index);
    if (props.widgetindex.length && index !== -1) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.widgetImage}
          src={images[index]}
          placeholder="blur"
          alt=""
        />
      );
    } else {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.widgetImage}
          src={"/editme.png"}
          placeholder="blur"
          alt=""
        />
      );
    }
  };

  const populateGallery = () => {
    return (
      <div className="gallery__container">
        {galleryImages &&
          galleryImages.map((imagelink: GalleryImage) => {
            const image = imagelink.contentUrl;
            return (
              <button
                className="gallery__btn"
                onClick={selectGalleryImage}
                key={image}
                value={image}
              >
                {/*eslint-disable-next-line @next/next/no-img-element*/}
                <img className="gallery__image" src={image} alt={image}></img>
              </button>
            );
          })}
      </div>
    );
  };

  const populateWhiteboard = () => {
    return (
      <ResponsiveGridLayout
        layouts={{
          lg: layout,
          md: layout,
          sm: layout,
          xs: layout,
          xxs: layout,
        }}
        className="layout"
        compactType={null}
        preventCollision={true}
        isResizable={true}
        resizeHandles={["se"]}
        onLayoutChange={(layout: Layout[]) => {
          setLayout(layout);
        }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      >
        {postit &&
          postit.map((singlePostit: Postit) => {
            const singleLayout = layout.find((x) => x.i === singlePostit.id);
            const text = singlePostit.postittext;
            if (singleLayout) {
              return (
                <PostIt
                  key={singlePostit.id}
                  data-grid={singleLayout}
                  // @ts-ignore: Unreachable code error
                  logger={logger}
                  coordinates={singleLayout.i}
                  text={text}
                  deleter={deleter}
                />
              );
            }
          })}
        {textbox &&
          textbox.map((singletextbox: Textbox) => {
            const singleLayout = layout.find((x) => x.i === singletextbox.id);
            const text = singletextbox.text;
            if (singleLayout) {
              return (
                <Text
                  key={singletextbox.id}
                  data-grid={singleLayout}
                  // @ts-ignore: Unreachable code error
                  logger={textlogger}
                  coordinates={singleLayout.i}
                  text={text}
                  deleter={textdeleter}
                />
              );
            }
          })}
        {boardImage &&
          boardImage.map((singleImage: WhiteboardImage) => {
            const singleLayout = layout.find((x) => x.i === singleImage.id);
            const imagefile = singleImage.url;
            if (singleLayout) {
              return (
                // eslint-disable-next-line jsx-a11y/alt-text
                <Image
                  key={singleImage.id}
                  data-grid={singleLayout}
                  // @ts-ignore: Unreachable code error
                  coordinates={singleLayout.i}
                  file={imagefile}
                  deleter={imagedeleter}
                />
              );
            }
          })}
        {link &&
          link.map((singleLink: WhiteboardLink) => {
            const singleLayout = layout.find((x) => x.i === singleLink.id);
            const name = singleLink.name;
            const url = singleLink.url;
            if (singleLayout) {
              return (
                // eslint-disable-next-line jsx-a11y/alt-text
                <WBLink
                  key={singleLink.id}
                  data-grid={singleLayout}
                  // @ts-ignore: Unreachable code error
                  coordinates={singleLayout.i}
                  name={name}
                  url={url}
                  deleter={linkdeleter}
                />
              );
            }
          })}
      </ResponsiveGridLayout>
    );
  };

  function logger(array: string[]) {
    setPostit((prevState) => {
      let nextState = [...prevState];
      const postitIndex = nextState.findIndex(
        (element) => element.id === array[1]
      );
      nextState[postitIndex].postittext = array[0];
      return nextState;
    });
  }

  function textlogger(array: string[]) {
    setTextbox((prevState) => {
      let nextState = [...prevState];
      const texttIndex = nextState.findIndex(
        (element) => element.id === array[1]
      );
      nextState[texttIndex].text = array[0];
      return nextState;
    });
  }

  function deleter(id: string) {
    setPostit((prevState) => {
      let nextState = [...prevState];
      const postitIndex = nextState.findIndex((element) => element.id === id);
      nextState.splice(postitIndex, 1);
      return nextState;
    });
  }

  function textdeleter(id: string) {
    setTextbox((prevState) => {
      let nextState = [...prevState];
      const textboxIndex = nextState.findIndex((element) => element.id === id);
      nextState.splice(textboxIndex, 1);
      return nextState;
    });
  }

  function imagedeleter(id: string) {
    setBoardImage((prevState) => {
      let nextState = [...prevState];
      const imageIndex = nextState.findIndex((element) => element.id === id);
      nextState.splice(imageIndex, 1);
      return nextState;
    });
  }

  function linkdeleter(id: string) {
    setLink((prevState) => {
      let nextState = [...prevState];
      const linkIndex = nextState.findIndex((element) => element.id === id);
      nextState.splice(linkIndex, 1);
      return nextState;
    });
  }

  function addImageFromGallery(files: any) {
    if (files) {
      const fileRef = files[0];
      const fileType: string = fileRef.type || "";
      if (fileType === "image/jpeg") {
        createImage(files[0]);
      } else {
        console.log("only jpeg!");
      }
    }
  }

  const openLinkSearchBox = () => {
    return (
      <div className="image-options-header">
        <div className="image-options-container">
          <div className="whiteboard__control">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createLink();
              }}
            >
              <input ref={linkName} type="text" placeholder="name" required />
              <input ref={linkUrl} type="text" placeholder="url" required />
              <input type="submit" name="" id="" />
            </form>
          </div>
        </div>
      </div>
    );
  };

  const openGallerySearchBox = () => {
    return (
      <div className="image-options-header">
        <div className="image-options-container">
          <div className="whiteboard__control">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createWebImage();
              }}
            >
              <input ref={linkUrl} type="text" placeholder="url" required />
              <input type="submit" name="" id="" />
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <article className={`widget ${props.priority}`} onClick={handleShow}>
        <div className="widget-container">
          <p className="widget-container__date">{widgetDate}</p>
          <div>
            <select
              defaultValue={"medium"}
              className="widget__select"
              onChange={(e) => {
                widgetPriority(e.target.value);
              }}
            >
              <option value="medium">none</option>
              <option value="high">high</option>
            </select>

            <button
              onClick={() => deleteWidget()}
              className="widget-container__remove-btn"
            >
              X
            </button>
          </div>
        </div>
        <div className={`widget__main ${props.priority}`}>
          {images.length > 0 && <>{widgetImage()}</>}
        </div>
      </article>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        fullscreen
        centered
      >
        <div className="whiteboard__header">
          <h3 className="whiteboard__title">{widgetDate}</h3>
          <div className="whiteboard__control-container">
            <div className="whiteboard__controlers">
              <div className="whiteboard__control">
                <button
                  onClick={createText}
                  className="whiteboard__control-btn"
                >
                  {/*eslint-disable-next-line @next/next/no-img-element*/}
                  <img
                    className="whiteboard__control-image"
                    src="/text.png"
                    alt=""
                  />
                </button>
                <p className="whiteboard__control-text">Text</p>
              </div>
              <div className="whiteboard__control">
                <button
                  onClick={createPostit}
                  className="whiteboard__control-btn"
                >
                  {/*eslint-disable-next-line @next/next/no-img-element*/}
                  <img
                    className="whiteboard__control-image"
                    src="/postit.png"
                    alt=""
                  />
                </button>
                <p className="whiteboard__control-text">Note</p>
              </div>
              <div className="whiteboard__control">
                <button className="whiteboard__control-btn">
                  {/*eslint-disable-next-line @next/next/no-img-element*/}
                  <img
                    className="whiteboard__control-image"
                    src="/image.png"
                    alt=""
                  />
                </button>
                <p className="whiteboard__control-text">Gallery</p>
              </div>
              <div className="whiteboard__control">
                <button
                  className="whiteboard__control-btn"
                  onClick={() => setGallerySearchBox(true)}
                >
                  {/*eslint-disable-next-line @next/next/no-img-element*/}
                  <img
                    className="whiteboard__control-image"
                    src="/image.png"
                    alt=""
                  />
                </button>
                <p className="whiteboard__control-text">Web Image</p>
              </div>
              <div className="whiteboard__control">
                <button
                  onClick={createLink}
                  className="whiteboard__control-btn"
                >
                  {/*eslint-disable-next-line @next/next/no-img-element*/}
                  <img
                    className="whiteboard__control-image"
                    src="/link.png"
                    alt=""
                  />
                </button>
                <p className="whiteboard__control-text">Link</p>
              </div>
            </div>
          </div>
          <div className="widget__btn-container">
            <button
              onClick={() =>
                widgetLayout(layout, postit, textbox, boardImage, link)
              }
              className="widget-container__save-btn"
            >
              Save
            </button>
            <button
              className="widget-container__close-btn"
              onClick={() => handleClose()}
            >
              X
            </button>
          </div>
        </div>
        {linkSearchBox === true && <>{openLinkSearchBox()}</>}
        {gallerySearchBox === true && <>{openGallerySearchBox()}</>}
        {galleryImages.length > 0 && <>{populateGallery()}</>}
        <Modal.Body className="whiteboard__body">
          <div className="whiteboard__photo">
            <div className={styles.whiteboard}>
              {postit && show === true && <>{populateWhiteboard()}</>}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Widget;

{
  /* <label className="custom-file-upload">
  <input type="file" onChange={(e) => addImageFromGallery(e.target.files)} />
  Gallery
</label>; */
}
