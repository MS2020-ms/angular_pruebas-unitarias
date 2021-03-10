import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { Book } from "src/app/models/book.model";
import { BookService } from "src/app/services/book.service";
import { HomeComponent } from "./home.component";

const listBook: Book[] = [
    {
        name: '',
        author: '',
        isbn: '',
        price: 15,
        amount: 2,
    },
    {
        name: '',
        author: '',
        isbn: '',
        price: 20,
        amount: 1,
    },
    {
        name: '',
        author: '',
        isbn: '',
        price: 8,
        amount: 5,
    },
];

//OP2: Servicio Mock
const bookServiceMock = {
    //devuelve un Observable de tipo Book[]
    getBooks: () => of(listBook),
};

//Pipe Mock -> ReduceTextPipeMock ira  a los declarations
@Pipe({ name: 'reduceText' })
class ReduceTextPipeMock implements PipeTransform {
    transform(): string {
        return '';
    }
}

describe('Home component', () => {

    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    //CONFIGURACION del test
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            declarations: [
                HomeComponent,
                ReduceTextPipeMock
            ],
            providers: [
                //OP1:
                // BookService //xa un servicio con uno o pocos metodos
                {
                    //OP2: Servicio Mock: xa un servicio con muchos metodos o dependencias que utilices sus propios servicios
                    //BookService en lugar de usar el metodo original, utilice el bookServiceMock
                    provide: BookService,
                    useValue: bookServiceMock,
                }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();
    });

    //INSTANCIA del test
    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        //instancia el componente y entra por el ngOnInit()
        fixture.detectChanges();
    });

    beforeAll(() => {
        //SOLO se va a llamar al principio del todo
    });

    afterEach(() => {
        //Se va a llamar despues de cada test
    });

    afterAll(() => {
        //SOLO se va a llamar al final del todo, cuando han terminado todos los test
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    //crear test xa metodo getBooks() con subscribe
    it('getBooks() get books from the subscription', () => {
        //me traigo el servicio
        const bookService = fixture.debugElement.injector.get(BookService);
        // const listBook: Book[] = [];

        // OP1: creo un espia xa similar el metodo y ver que es llamado
        // getBooks no devuelve un array de libros, devuelve un observable -> of(listBook)
        // const spy1 = spyOn(bookService, 'getBooks').and.returnValue(of(listBook));

        // OP2: Servicio Mock

        //xa depurar un test con Karma -> navegador karma sources
        //debugger;

        component.getBooks();

        // expect(spy1).toHaveBeenCalled();
        // expect(component.listBook.length).toBe(0); para const listBook: Book[] = [];
        expect(component.listBook.length).toBe(3);
    });

});