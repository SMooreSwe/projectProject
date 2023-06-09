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
  GalleryImage,
  GalleryLink,
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
import next from "next";

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

  const [galleryLinks, setGalleryLinks] = useState<GalleryLink[]>([]);
  const [linkSearchBox, setLinkSearchBox] = useState(false);
  const [gallerySearchLinks, setGallerySearchLinks] = useState(false);

  const [galleryError, setGalleryError] = useState(false);

  const [widgetImage, setWidgetImage] = useState<string[]>([]);
  const [saveWidgetIndex, setSaveWidgetIndex] = useState<string[]>([]);

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
    if (props.widgetindex) {
      setSaveWidgetIndex(props.widgetindex)
    }
  }, [show, props.widgetid, props.layout]);

  useEffect(() => {
    setWidgetImage(props.widgetimages);
  }, [props.widgetimages, show]);

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
    const storage = getStorage();
    const filePath = `/widgets/${widgetid}.jpeg`;
    const storageRef = ref(storage, filePath);

    const blob = await (await fetch(imgData)).blob();

    uploadBytes(storageRef, blob)
    .then((snapshot) => {
      return getDownloadURL(snapshot.ref);
    })
    .then((downloadURL) => {    
      if (saveWidgetIndex.includes(props.widgetid)) {
        const index = saveWidgetIndex.indexOf(props.widgetid);
        setWidgetImage((prevState) => {
          let nextState = [...prevState]
          nextState[index] = (downloadURL);
          return nextState
        })
      } else {
        setSaveWidgetIndex((prevState) => {
          let nextState = [...prevState]
          nextState.push(widgetid);
          return nextState
        })
        setWidgetImage((prevState) => {
          let nextState = [...prevState]
          nextState.push(downloadURL);
          return nextState
        })
      }
    })
  }

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
  const searchLinkInput = useRef<HTMLInputElement>(null);
  const createLinkImage = async () => {
    console.log("CREATE LINK IMAGE");
    if (
      searchLinkInput.current?.value &&
      searchLinkInput.current!.value.length > 0
    ) {
      setGallerySearchLinks(true);
      const searchLink = searchLinkInput.current!.value;
      let subscriptionKey = process.env.NEXT_PUBLIC_WEB_API;
      try {
        const response = await axios(
          "https://api.bing.microsoft.com/v7.0/search" +
            "?q=" +
            encodeURIComponent(searchLink),
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
              responseFilter: "images",
            },
          }
        );
        console.log(response.data);
        if (response.data.images.value) {
          const imageArray = response.data.images.value.slice(0, 8);
          setGalleryLinks(imageArray);
          setLinkSearchBox(false);
        }
      } catch (err) {
        setGalleryError(true);
        setTimeout(() => setGalleryError(false), 2500);
        setLinkSearchBox(false);
      }
    }
  };

  const searchImageInput = useRef<HTMLInputElement>(null);
  const createWebImage = async () => {
    if (
      searchImageInput.current?.value &&
      searchImageInput.current!.value.length > 0
    ) {
      setGallerySearchImages(true);
      const searchText = searchImageInput.current!.value;
      let subscriptionKey = process.env.NEXT_PUBLIC_IMAGE_API;
      try {
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
        if (response.data.value) {
          setGalleryImages(response.data.value);
          setGallerySearchBox(false);
        }
      } catch (err) {
        setGalleryError(true);
        setTimeout(() => setGalleryError(false), 2500);
        setGallerySearchBox(false);
      }
    }
  };

  const selectGalleryImage = (e: any) => {
    const uuid = v4();
    const imageurl = e.target.currentSrc;
    const newImage = { id: uuid, url: imageurl };
    const newImageArray = [...boardImage, newImage];
    const newLayoutArray = [
      ...layout,
      { w: 1, h: 1, x: 1, y: 1, i: uuid, moved: false, static: false },
    ];
    setBoardImage(newImageArray);
    setLayout(newLayoutArray);
    setGallerySearchImages(false);
  };

  const selectLinkImage = (websiteInput: string, thumbnailInput: string) => {
    const uuid = v4();
    const newLink = {
      id: uuid,
      hostPageUrl: websiteInput,
      thumbnailurl: thumbnailInput,
    };
    const newLinkArray = [...link, newLink];
    const newLayoutArray = [
      ...layout,
      { w: 1, h: 1, x: 1, y: 1, i: uuid, moved: false, static: false },
    ];
    setLink(newLinkArray);
    setLayout(newLayoutArray);
    setGallerySearchLinks(false);
  };

  const populatewWidgetImage = () => {
    const array = props.widgetindex;
    const index = array.indexOf(props.widgetid);
    const index2 = saveWidgetIndex.indexOf(props.widgetid);

    if (props.widgetindex.length && index !== -1 && widgetImage.length > 0) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.widgetImage}
          src={widgetImage[index]}
          placeholder="blur"
          alt=""
        />
      );
    } else if (index2 !== -1 && widgetImage.length > 0) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.widgetImage}
          src={widgetImage[index2]}
          placeholder="blur"
          alt=""
        />
      );
    } else {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.widgetImage}
          src={"/doubleclick2.png"}
          placeholder="blur"
          alt=""
        />
      );
    }
  };

  const populateLinksGallery = () => {
    return (
      <div className="gallery__container">
        {galleryLinks &&
          galleryLinks.map((imagelink: GalleryLink) => {
            const thumbnail = imagelink.thumbnailUrl;
            const link = imagelink.hostPageUrl;
            return (
              <button
                className="gallery__btn"
                onClick={() => selectLinkImage(link, thumbnail)}
                key={thumbnail}
                value={thumbnail}
              >
                {/*eslint-disable-next-line @next/next/no-img-element*/}
                <img
                  className="gallery__image"
                  src={thumbnail}
                  alt={link}
                ></img>
                <p>{link}</p>
              </button>
            );
          })}
      </div>
    );
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

  const showGalleryError = () => {
    return (
      <div className="image-options-header">
        <div className="image-options-searchbar">
          <p>No search results were found. Please try again.</p>
        </div>
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
            const website = singleLink.hostPageUrl;
            const imageurl = singleLink.thumbnailurl;
            if (singleLayout) {
              return (
                // eslint-disable-next-line jsx-a11y/alt-text
                <WBLink
                  key={singleLink.id}
                  data-grid={singleLayout}
                  // @ts-ignore: Unreachable code error
                  coordinates={singleLayout.i}
                  website={website}
                  imageurl={imageurl}
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
        <form
          className="image-options-searchbar"
          onSubmit={(e) => {
            e.preventDefault();
            createLinkImage();
          }}
        >
          <input
            className="image-options-textfield"
            ref={searchLinkInput}
            type="text"
            placeholder="Search for websites..."
            required
          />
          <input
            type="submit"
            name=""
            id=""
            value="Search"
            className="image-options-btn"
          />
        </form>
      </div>
    );
  };

  const openGallerySearchBox = () => {
    return (
      <div className="image-options-header">
        <form
          className="image-options-searchbar"
          onSubmit={(e) => {
            e.preventDefault();
            createWebImage();
          }}
        >
          <input
            className="image-options-textfield"
            ref={searchImageInput}
            type="text"
            placeholder="Search for images..."
            required
          />
          <input
            type="submit"
            name=""
            id=""
            value="Search"
            className="image-options-btn"
          />
        </form>
      </div>
    );
  };

  return (
    <>
      <article className={`widget ${props.priority}`} onClick={handleShow}>
        <div className="widget-container">
          <div>
            <p className="widget-container__date">{widgetDate}</p>
          </div>
          <div>
            <select
                defaultValue={"medium"}
                className="widget__select"
                onChange={(e) => {
                  widgetPriority(e.target.value)}}>
                <option value="medium">none</option>
                <option value="high">high</option>
            </select>
            </div>
            <div>
              <button
                onClick={() => deleteWidget()}
                className="widget-container__remove-btn"
              >
                X
              </button>
            </div>
        </div>
        <div className={`widget__main ${props.priority}`}>
          {saveWidgetIndex && <>{populatewWidgetImage()}</>}
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
                <label className="whiteboard__control-btn">
                  <input
                    type="file"
                    onChange={(e) => addImageFromGallery(e.target.files)}
                  />
                  {/*eslint-disable-next-line @next/next/no-img-element*/}
                  <img
                    className="whiteboard__control-image"
                    src="/image.png"
                    alt=""
                  />
                </label>
                <p className="whiteboard__control-text">Image file</p>
              </div>
              <div className="whiteboard__control">
                <button
                  className="whiteboard__control-btn"
                  onClick={() => {
                    setGallerySearchBox(!gallerySearchBox)
                    setLinkSearchBox(false)
                    setGallerySearchImages(false)
                  }}
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
                  onClick={() => {
                    setLinkSearchBox(!linkSearchBox)
                    setGallerySearchBox(false)
                    setGallerySearchLinks(false)
                  }}
                  className="whiteboard__control-btn"
                >
                  {/*eslint-disable-next-line @next/next/no-img-element*/}
                  <img
                    className="whiteboard__control-image"
                    src="/link.png"
                    alt=""
                  />
                </button>
                <p className="whiteboard__control-text">Web Link</p>
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
              onClick={() => {
                setGallerySearchBox(false);
                setGallerySearchImages(false);
                setLinkSearchBox(false);
                setGallerySearchLinks(false);
                handleClose();
              }}
            >
              X
            </button>
          </div>
        </div>
        {linkSearchBox === true && <>{openLinkSearchBox()}</>}
        {gallerySearchBox === true && <>{openGallerySearchBox()}</>}

        {gallerySearchImages === true && galleryImages.length > 0 && (
          <>{populateGallery()}</>
        )}
        {gallerySearchLinks === true && galleryLinks.length > 0 && (
          <>{populateLinksGallery()}</>
        )}
        {galleryError === true && <>{showGalleryError()}</>}
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
