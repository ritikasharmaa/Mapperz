import React from 'react';
import {Text, Image} from 'react-native'
import textResource from '../assets/textResource'

export const showImage = (image, type) => {
  if (!image) {
		if (type === 'user') {
			return 'http://www.automotiveone.com/wp-content/uploads/2019/02/placeholder-user-image.jpg'
		} else if(type === 'spot'){
      return 'https://image.freepik.com/free-vector/destination-concept-international-travel-journey-red-pointer-with-grey-world-map-inside_333792-53.jpg'
    } else {
			return 'https://images.unsplash.com/photo-1512529920731-e8abaea917a5?fit=crop&w=840&q=80'
		}		
	} else if (image.indexOf('http') == -1) {
    //return 'https://www.travelz.jp/'+image
    return 'https://www.mapperz.jp/'+image
	} else {
		return image
	}
  
	 
}

export const renderImage = (image, type, pathOnly) => {
	if (!image) {
		if (type === 'user') {
			return require('../assets/images/User2.png')
	  } else if(type === 'map'){
      return require('../assets/images/MapPlaceholder.png')
    } else {
      return require('../assets/images/dummyImage.jpg')
    }
  } else if (image.indexOf('http') == -1) {
      //return 'https://www.travelz.jp/'+image
      if(pathOnly){
        return 'https://www.mapperz.jp/'+image
      } else {
        return {uri : 'https://www.mapperz.jp/'+ image}
      }     
	} else {
    if(pathOnly){
      return image
    } else {
      return {uri: image}
    }		
	}
}

export const renderTitle = (title) => {
  if (typeof(title) === 'object') {
    return title.join(', ')
  } else {
    return title
  }
}

export  const convertText = (key, lang) => {
  return textResource[`${key}.${lang}`] 
}

export const CustomFont = (props) => <Text style={[{fontFamily: ((Platform.OS === 'ios') && 'HiraMaruProN-W4')}, props.style]} >{props.children}</Text>

export const language = (lang, name, localName) => {
  if(lang === 'en'){
    return name ? name : localName
  } else {
    return localName ? localName : name
  }
}

export const objectToFormData = (obj, cfg = {indices: true}, fd, pre) => {
        // https://github.com/therealparmesh/object-to-formdata

        const isUndefined = value => value === undefined

        const isNull = value => value === null

        const isObject = value => value === Object(value)

        const isArray = value => Array.isArray(value)

        const isDate = value => value instanceof Date

        const isBlob = value =>
          value &&
          typeof value.size === 'number' &&
          typeof value.type === 'string' &&
          typeof value.slice === 'function'

        const isFile = value =>
          isBlob(value) &&
          typeof value.name === 'string' &&
          (typeof value.lastModifiedDate === 'object' ||
            typeof value.lastModified === 'number')

        const objectToFormData = (obj, cfg, fd, pre) => {
          cfg = cfg || {}
          cfg.indices = isUndefined(cfg.indices) ? false : cfg.indices
          cfg.nullsAsUndefineds = isUndefined(cfg.nullsAsUndefineds) ? false : cfg.nullsAsUndefineds
          fd = fd || new FormData()

          if (isUndefined(obj)) {
            return fd
          } else if (isNull(obj)) {
            if (!cfg.nullsAsUndefineds) {
              fd.append(pre, '')
            }
          } else if (isArray(obj)) {
            if (!obj.length) {
              const key = pre + '[]'
              fd.append(key, '')
            } else {
              obj.forEach((value, index) => {
                const key = pre + '[' + (cfg.indices ? index : '') + ']'
                objectToFormData(value, cfg, fd, key)
              })
            }
          } else if (isDate(obj)) {
            fd.append(pre, obj.toISOString())
          } else if (isObject(obj) && !isFile(obj) && !isBlob(obj)) {
            Object.keys(obj).forEach(prop => {
              const value = obj[prop]

              if (isArray(value)) {
                while (prop.length > 2 && prop.lastIndexOf('[]') === prop.length - 2) {
                  prop = prop.substring(0, prop.length - 2)
                }
              }

              const key = pre ? pre + '[' + prop + ']' : prop
              objectToFormData(value, cfg, fd, key)
            })
          } else {
            fd.append(pre, obj)
          }

          return fd
        }

        return objectToFormData(obj, cfg, fd, pre);
      }
