<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use GuzzleHttp\Client;

use Illuminate\Routing\Controller as BaseController;

class ApiController extends BaseController
{
   public function getCampaignData(){

        $client = new Client();
        // $search = ["[", "]", "},"];
        // $replace = ["", "", "}"];  
        $campaignArray = [];
        // $filePath = 'file/campaign.txt'; 
        // $fileContents = Storage::get($filePath);
        // $fileLines = explode("\n", $fileContents);
        $path = storage_path('app/file/campaign.txt');
        if (file_exists($path)) {
            $existingData = file_get_contents($path);
            $fileLines = json_decode($existingData, true);
        }
        
      
        try {

            $response = $client->request('GET', 'https://jsonplaceholder.typicode.com/users');
            $statusCode = $response->getStatusCode();
            $data = json_decode($response->getBody()->getContents(),true);
            foreach ($fileLines as $campaignData) {
                // $campaignVal = json_decode(str_replace($search, $replace,$campaignData), true);
                // print_r($campaignData);
                $isUserExist = 0;
                foreach($data as $userData) {
                    if($campaignData['id'] === $userData['id']){
                        $campaignData['username'] = $userData['name'];
                        $isUserExist = 1;
                    }
                  
                }
                if(!$isUserExist){
                    $campaignData['username'] = 'Unknown user';
                }
                array_push($campaignArray,$campaignData);
               
             }

            return response()->json($campaignArray);

        } catch (GuzzleHttp\Exception\RequestException $e) {
          
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    

   }

   public function postCampaignData(Request $request){

        $validatedData = $request->validate([
            'name' => 'required',
            'startDate' => 'required',
            'endDate' => 'required',
            'budget' => 'required',
        ]);

        $name = $request->input('name');
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
        $budget = $request->input('budget');

        $filename = 'campaign.txt';

        $data = [];

        $path = storage_path('app/file/' . $filename);
        if (file_exists($path)) {
            $existingData = file_get_contents($path);
            $data = json_decode($existingData, true);
        }

       
        $newObject = [
            'id' => end($data)['id']+1,
            'name' => $name,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'Budget' => (int)$budget,
            'userId' => 12
        ];

        // print_r( $newObject);exit;


        $data[] = $newObject;
        $jsonData = json_encode($data);
        // print_r($jsonData);
        file_put_contents($path, $jsonData);

        return response()->json([
            'message' => 'Campaign created successfully',
           
        ], 201);
   }
}
