// inspired by
// https://github.com/micro-frontends-demo
// https://github.com/micro-frontends-demo/container

import * as React from 'react';

interface MicroFrontendProps {
  id: string;
  jsSrc: string;
  jsIntegrity: string;
  stylesheetSrc?: string;
  stylesheetIntegrity?: string;
  onReady: () => void;
  onError: () => void;
}

const createScriptTagElement = (src, id, integrity, onReady, onError) => {
  const scriptElement = document.createElement('script');
  scriptElement.src = src;
  scriptElement.onload = onReady;
  scriptElement.onerror = onError;
  scriptElement.id = id;
  scriptElement.integrity = integrity;
  scriptElement.crossOrigin = 'anonymous';
  return scriptElement;
};

const createLinkTagElement = (src, id, integrity) => {
  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = src;
  linkElement.id = id;
  linkElement.integrity = integrity;
  linkElement.crossOrigin = 'anonymous';
  return linkElement;
};

const addElementToDOM = elementCreator => {
  const element = elementCreator();
  document.head.appendChild(element);
};

const cleanupExternals = (scriptId, linkId) => {
  document.getElementById(scriptId).remove();
  document.getElementById(linkId).remove();
};

export default ({
  jsSrc,
  stylesheetSrc,
  jsIntegrity,
  stylesheetIntegrity,
  id,
  onReady,
  onError,
}: MicroFrontendProps) => {
  const scriptId = `${id}-js`;
  const linkId = `${id}-styles`;

  React.useEffect(() => {
    if (document.getElementById(scriptId) === null) {
      addElementToDOM(() => createScriptTagElement(jsSrc, scriptId, jsIntegrity, onReady, onError));
    }
    if (document.getElementById(linkId) === null && stylesheetSrc) {
      addElementToDOM(() => createLinkTagElement(stylesheetSrc, linkId, stylesheetIntegrity));
    }
    return () => cleanupExternals(scriptId, linkId);
  }, []);

  return <main id={id} />;
};
