<script>
    import { enhance } from '$app/forms'; 
    import markdownit from 'markdown-it'; 
    import FileSaver from 'file-saver';  
    export let form 

    const md = markdownit()
    let loading = false; 
    let resultModalElement;
 
    const downloadWord = async () => { 

        try {
            const documentTitle = resultModalElement.querySelector('.no-tailwindcss-base h2').textContent;
            const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
            const postHtml = "</body></html>";
    
            const contentToConvert = preHtml + resultModalElement.querySelector(".no-tailwindcss-base").innerHTML + postHtml;
            const doucmentBlob = new Blob(['\ufeff', contentToConvert], {
                    type: 'application/msword'
            }); 
            FileSaver.saveAs(doucmentBlob, documentTitle ?? 'lesson.doc');
        } catch (err) {
            console.log(err)
            alert(err)
        }
    }
     
   
    const handleGenerate = () => {
        loading = true;
        return async ({ result, update }) => {
            form = result?.data;
            switch (result.type) {
                case 'success': 
                    await update();
                    resultModalElement.showModal();
                    break;
                case 'failure':
                    break; 
                } 
                loading = false;  
            }
    }; 
</script>

<!-- Modal -->
  
<dialog bind:this={resultModalElement} id="resultModal" class="modal">
  <div class="modal-box w-11/12 max-w-5xl">
    <div class="no-tailwindcss-base">{@html md.render(form?.genAiResult ?? '')}</div>
    <div class="modal-action">
        <form method="dialog"> 
            <button class="btn">Close</button>
          </form> 
      <button type="button" on:click={() => downloadWord()} class="btn btn-primary">Download</button>  
    </div>
  </div>
</dialog>



<!-- END Modal -->
<div class="container mx-auto h-screen">
    <div class="h-full flex items-center justify-center">
        <form use:enhance={handleGenerate} method="post" class="w-full space-y-4 max-w-2xl mx-8 lg:mx-0"> 
             
            <h1 class="text-2xl text-center font-bold">Lesson Plan Generator</h1> 
            
            <!-- Format -->
            <label  class="form-control w-full">
                <div class="label">
                    <span class="label-text">Lesson plan format</span> 
                </div>
                <select value={form?.data?.format ?? 'Select lesson plan format'} name="format" class="select select-bordered {form?.errors?.format ? 'select-error' : ''} ">
                    <option disabled selected>Select lesson plan format</option>
                    <option>4As</option>
                    <option>5Es</option>
                    <option>7Es</option>
                    <option>MATATAG</option>
                </select>
                {#if form?.errors?.format}
                    <div class="label">
                        <span class="label-text text-red-800">{form?.errors?.format[0] ?? '' }</span> 
                    </div>
                {/if}
            </label>

            <!-- Subject -->
             <label class="form-control w-full"> 
                <div class="label">
                    <span class="label-text">Subject</span>
                </div>
                <input value={form?.data?.subject ?? ''} name="subject" type="text" placeholder="Subject" class="input input-bordered w-full {form?.errors?.subject ? 'input-error' : ''}" />
                {#if form?.errors?.subject}
                    <div class="label">
                        <span class="label-text text-red-700">{form?.errors?.subject[0] ?? '' }</span> 
                    </div>
                {/if}
            </label>

            <!-- Grade Level -->
            <label class="form-control w-full"> 
                <div class="label">
                    <span class="label-text">Grade level</span>
                </div>
                <select value={form?.data?.gradeLevel ?? 'Select grade level'} name="gradeLevel" class="select select-bordered w-full {form?.errors?.gradeLevel ? 'select-error' : ''}">
                    <option disabled selected>Select grade level</option>
                    <option>Grade 1</option> 
                    <option>Grade 2</option>
                    <option>Grade 3</option>
                    <option>Grade 4</option>
                    <option>Grade 5</option>
                    <option>Grade 6</option>
                    <option>Grade 7</option>
                    <option>Grade 8</option>
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                    <option>Grade 11</option>
                    <option>Grade 12</option>
                </select>
                {#if form?.errors?.gradeLevel}
                    <div class="label">
                        <span class="label-text text-red-700">{form?.errors?.gradeLevel[0] ?? '' }</span> 
                    </div>
                {/if}
            </label>

            <!-- Objectives -->
            <label class="form-control w-full"> 
                <div class="label">
                    <span class="label-text font-semibold">Objectives</span>
                </div>
                <small class="font-thin italic text-xs ms-1 mb-1">At the end of the lesson the students should be able to...</small>
                <textarea value={form?.data?.objectives ?? ''} rows="6" name="objectives" class="textarea textarea-bordered w-full {form?.errors?.objectives ? 'textarea-error' : ''}" placeholder="e.g. solve multi-digit multiplication problems using the standard algorithm and apply this skill to real-world scenarios, such as calculating total costs or quantities."></textarea>
                {#if form?.errors?.objectives}
                    <div class="label">
                        <span class="label-text text-red-700">{form?.errors?.objectives[0] ?? '' }</span> 
                    </div>
                {/if}
            </label>

            <!-- Submit -->
            <button disabled={loading} type="submit" class="btn btn-primary btn-block mt-4">
                {#if loading}
                    <span class="loading loading-spinner loading-md me-2"></span> Generating...
                {:else}
                    Generate
                {/if}
            </button>
            {#if form?.genAiResult}
                <button disabled={form?.genAiResult === ''}  type="button" on:click={() => resultModalElement.showModal()} class="btn btn-primary btn-block mt-4">Preview last generated</button> 
            {/if}
        </form>
    </div>
</div>