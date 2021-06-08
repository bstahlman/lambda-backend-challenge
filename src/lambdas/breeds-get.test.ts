import fetch from 'node-fetch'
import { handler } from './breeds-get'

const mockedFetch: jest.Mock = fetch as any
const mockPayload =
  '{"message":{"affenpinscher":[],"african":[],"airedale":[],"akita":[],"appenzeller":[],"australian":["shepherd"],"basenji":[],"beagle":[],"bluetick":[],"borzoi":[],"bouvier":[],"boxer":[],"brabancon":[],"briard":[],"buhund":["norwegian"],"bulldog":["boston","english","french"],"bullterrier":["staffordshire"],"cairn":[],"cattledog":["australian"],"chihuahua":[],"chow":[],"clumber":[],"cockapoo":[],"collie":["border"],"coonhound":[],"corgi":["cardigan"],"cotondetulear":[],"dachshund":[],"dalmatian":[],"dane":["great"],"deerhound":["scottish"],"dhole":[],"dingo":[],"doberman":[],"elkhound":["norwegian"],"entlebucher":[],"eskimo":[],"finnish":["lapphund"],"frise":["bichon"],"germanshepherd":[],"greyhound":["italian"],"groenendael":[],"havanese":[],"hound":["afghan","basset","blood","english","ibizan","plott","walker"],"husky":[],"keeshond":[],"kelpie":[],"komondor":[],"kuvasz":[],"labradoodle":[],"labrador":[],"leonberg":[],"lhasa":[],"malamute":[],"malinois":[],"maltese":[],"mastiff":["bull","english","tibetan"],"mexicanhairless":[],"mix":[],"mountain":["bernese","swiss"],"newfoundland":[],"otterhound":[],"ovcharka":["caucasian"],"papillon":[],"pekinese":[],"pembroke":[],"pinscher":["miniature"],"pitbull":[],"pointer":["german","germanlonghair"],"pomeranian":[],"poodle":["miniature","standard","toy"],"pug":[],"puggle":[],"pyrenees":[],"redbone":[],"retriever":["chesapeake","curly","flatcoated","golden"],"ridgeback":["rhodesian"],"rottweiler":[],"saluki":[],"samoyed":[],"schipperke":[],"schnauzer":["giant","miniature"],"setter":["english","gordon","irish"],"sheepdog":["english","shetland"],"shiba":[],"shihtzu":[],"spaniel":["blenheim","brittany","cocker","irish","japanese","sussex","welsh"],"springer":["english"],"stbernard":[],"terrier":["american","australian","bedlington","border","dandie","fox","irish","kerryblue","lakeland","norfolk","norwich","patterdale","russell","scottish","sealyham","silky","tibetan","toy","westhighland","wheaten","yorkshire"],"vizsla":[],"waterdog":["spanish"],"weimaraner":[],"whippet":[],"wolfhound":["irish"]},"status":"success"}'

jest.mock('node-fetch')

describe('breeds-get handler', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it('returns 200 status code if the request is valid', async () => {
    mockedFetch.mockReturnValueOnce({
      json: () => {
        return mockPayload
      },
    })
    const response = await handler()
    const expectedResponse = 200
    expect(response).toMatchObject({ statusCode: expectedResponse })
  })

  it('returns list of breeds if the request is valid', async () => {
    mockedFetch.mockReturnValueOnce({
      json: () => {
        return mockPayload
      },
    })
    const response = await handler()
    const expectedResponse =
      '["affenpinscher","african","airedale","akita","appenzeller","shepherd","basenji","beagle","bluetick","borzoi","bouvier","boxer","brabancon","briard","norwegian","boston","english","french","staffordshire","cairn","australian","chihuahua","chow","clumber","cockapoo","border","coonhound","cardigan","cotondetulear","dachshund","dalmatian","great","scottish","dhole","dingo","doberman","norwegian","entlebucher","eskimo","lapphund","bichon","germanshepherd","italian","groenendael","havanese","afghan","basset","blood","english","ibizan","plott","walker","husky","keeshond","kelpie","komondor","kuvasz","labradoodle","labrador","leonberg","lhasa","malamute","malinois","maltese","bull","english","tibetan","mexicanhairless","mix","bernese","swiss","newfoundland","otterhound","caucasian","papillon","pekinese","pembroke","miniature","pitbull","german","germanlonghair","pomeranian","miniature","standard","toy","pug","puggle","pyrenees","redbone","chesapeake","curly","flatcoated","golden","rhodesian","rottweiler","saluki","samoyed","schipperke","giant","miniature","english","gordon","irish","english","shetland","shiba","shihtzu","blenheim","brittany","cocker","irish","japanese","sussex","welsh","english","stbernard","american","australian","bedlington","border","dandie","fox","irish","kerryblue","lakeland","norfolk","norwich","patterdale","russell","scottish","sealyham","silky","tibetan","toy","westhighland","wheaten","yorkshire","vizsla","spanish","weimaraner","whippet","irish"]'
    expect(response).toMatchObject({ body: expectedResponse })
  })

  it('returns 500 status code if the request is invalid', async () => {
    mockedFetch.mockReturnValueOnce({
      json: () => {
        return '{"message":null,"status":"Server Exception"}'
      },
    })
    const response = await handler()
    const expectedResponse = 500
    expect(response).toMatchObject({ statusCode: expectedResponse })
  })

  it('returns 500 status code if the request times out', async () => {
    const response = await handler(100)
    const expectedResponse = 500
    expect(response).toMatchObject({ statusCode: expectedResponse })
  })
})
