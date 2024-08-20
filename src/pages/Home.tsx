import { useEffect, useRef, useState } from 'react';
import { createGesture, Gesture, GestureDetail, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonLabel, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar, SegmentCustomEvent } from '@ionic/react';
import './Home.css';

const segments = [1,2,3,4,5,6];
const cards = [1,2,3,4,5,6,7,8,9,10];

const Home: React.FC = () => {
  const contentRef = useRef<HTMLIonContentElement>(null);
  const [enableVerticalScroll, setEnableVerticalScroll] = useState(true);
  const [segmentValue, setSegmentValue] = useState<number>(1);

  useEffect(() => {
    let gesture: Gesture|undefined;

    if (contentRef.current) {
      // Create gesture that requires user to drag at least 30px and at 45 degrees or less off x-axis to trigger
      gesture = createGesture({
        gestureName: 'segmentHorizontalSwipe',
        passive: true,
        threshold: 30,
        maxAngle: 45,
        direction: 'x',
        el: contentRef.current,
        onStart: () => {
          // 'disableScroll' did seem unreliable (filed internal ticket with Ionic FW team), use this to toggle `scrollY` on IonContent
          setEnableVerticalScroll(false);
        },
        onEnd: (detail: GestureDetail) => {
          // 'disableScroll' did seem unreliable (filed internal ticket with Ionic FW team), use this to toggle `scrollY` on IonContent
          setEnableVerticalScroll(true);
          handleSwipeSegment(detail);
        }
      });

      gesture.enable();
    }

    return () => {
      if (gesture) {
        gesture.destroy();
      }
    }
  }, [contentRef]);

  const handleSwipeSegment = (detail: GestureDetail) => {
    if (detail.deltaX < 0) {
      // When user swipes from right->left go to next higher available segment
      setSegmentValue((oldSegment) => {
        const next = oldSegment + 1;
        const limit = segments[segments.length - 1];
        return next < limit ? next : limit;
      });
    }
    if (detail.deltaX > 0) {
      // When user swipes from left->right go to next lower available segment
      setSegmentValue((oldSegment) => {
        const next = oldSegment - 1;
        const limit = segments[0];
        return next > limit ? next : limit;
      });
    }
  };

  const handleSegmentIonChange = (event: SegmentCustomEvent) => {
    event.detail.value && setSegmentValue(+event.detail.value);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment scrollable={true} value={segmentValue} onIonChange={handleSegmentIonChange}>
            {segments.map((number) => (
              <IonSegmentButton key={number} value={number}>
                <IonLabel>Value {number}</IonLabel>
              </IonSegmentButton>
            ))}
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={enableVerticalScroll} ref={contentRef}>
        {cards.map((number) => (
          <IonCard key={number}>
            <IonCardHeader>
              <IonCardTitle>Card Title</IonCardTitle>
              <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
            </IonCardHeader>
      
            <IonCardContent>Here's a small text description for the card content. Nothing more, nothing less.</IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Home;
