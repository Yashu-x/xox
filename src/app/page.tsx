import NormalBord from "@/components/Normal/NormalBord";

export default function Home() {
  return (
    <>
    <NormalBord gameid="123" players={[
                {
                    "id": "678cde72792feae8d4f49089",
                    "name": "yasitha Renuka",
                    "email": "yasitha.renuk@gmail.com"
                },
                {
                    "id": "678d18eff414bd99a9608e96",
                    "name": "aka ratahawa",
                    "email": "akaratahawa@gmail.com"
                }
            ]} moves={["","","","","","","","",""]}
            lastmoveId={""}
            islastX={true}/>
    </>
  );
}
